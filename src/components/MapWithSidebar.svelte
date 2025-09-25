<script>
  import { onMount, onDestroy } from 'svelte';
  import 'leaflet/dist/leaflet.css';
  import SidebarZAE from './SidebarZAE.svelte';
  import { iconPathForCategory } from '../utils/zae-icons.ts';

  let mapEl;
  let map; // Leaflet map instance
  let polygonsLayer; // communes
  let zaeLayer; // overlays

  let categories = $state([]);
  let activeCategories = $state(new Set());
  let sidebarOpened = $state(false);

  // UI colors from CSS variables
  function readThemeVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name)?.trim();
      return v || fallback;
    } catch (_) {
      return fallback;
    }
  }

  const PRIMARY = () => readThemeVar('--primary', '#2e8b57');
  const SECONDARY = () => readThemeVar('--secondary', '#1b365d');


  function setMapSectionHeight() {
    const sectionEl = mapEl?.closest('.map-section');
    if (!sectionEl) return;
    const header = document.querySelector('.site-header') || document.querySelector('header');
    const headerH = header ? header.offsetHeight : 0;
    const h = Math.max(320, window.innerHeight - headerH);
    sectionEl.style.height = h + 'px';
    setTimeout(() => { try { map?.invalidateSize(); } catch (_) {} }, 50);
  }

  function applyZaeFilter() {
    if (!zaeLayer) return;
    const actives = activeCategories.size ? activeCategories : new Set(categories);
    zaeLayer.eachLayer(l => {
      const show = actives.has(l.featureCategory);
      if (l.setStyle) l.setStyle({ opacity: show ? 0.9 : 0, fillOpacity: show ? 0.2 : 0 });
      if (show) { l.addTo(map); } else { l.removeFrom(map); }
    });
  }

  function onFilterChange(e) {
    const next = e?.detail?.actives;
    activeCategories = next instanceof Set ? next : new Set(next || []);
    applyZaeFilter();
    setTimeout(() => map?.invalidateSize(), 150);
  }

  function onToggle() {
    sidebarOpened = !sidebarOpened;
    setTimeout(() => map?.invalidateSize(), 150);
  }

  // Runes effects (Svelte 5)
  $effect(() => {
    // depend explicitly on set size and categories length to track changes
    const _s = activeCategories.size;
    const _c = categories.length;
    applyZaeFilter();
  });

  $effect(() => {
    const _o = sidebarOpened;
    setTimeout(() => map?.invalidateSize(), 150);
  });

  onMount(async () => {
    try {
      const [{ default: L }, { default: proj4 }] = await Promise.all([
        import('leaflet'),
        import('proj4')
      ]);
      // Build map and set a default view immediately
      map = L.map(mapEl, { scrollWheelZoom: true, attributionControl: true });
      map.setView([48.787, -0.197], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);

    // Labels pane above polygons
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;
    map.getPane('labels').style.pointerEvents = 'none';

      // Responsive section height
      setMapSectionHeight();
      window.addEventListener('resize', setMapSectionHeight);

      try {
      const [gj, rawData] = await Promise.all([
        fetch('/assets/datas/geojson/Putanges_wgs84.geojson').then(r => r.json()),
        fetch('/assets/datas/geojson/donnees-communes.json').then(r => r.ok ? r.json() : {}).catch(() => ({}))
      ]);

      const index = new Map();
      try {
        const list = Array.isArray(rawData?.communes) ? rawData.communes : [];
        for (const item of list) {
          const nom = item.nom || item.NOM;
          const popVal = item.population?.valeur ?? item.population;
          const popAnnee = item.population?.annee ?? item.annee;
          if (!nom) continue;
          index.set(String(nom).trim().toLowerCase(), { population: popVal, annee: popAnnee });
        }
      } catch (_) {}

      const baseStyle = { color: PRIMARY(), weight: 2, opacity: 1, fillColor: PRIMARY(), fillOpacity: 0.08 };
      const highlightStyle = { weight: 3, fillOpacity: 0.15 };

      map.createPane('polygons');
      map.getPane('polygons').style.zIndex = 640;
      polygonsLayer = L.geoJSON(gj, {
        style: () => baseStyle,
        pane: 'polygons',
        onEachFeature: (feature, lyr) => {
          const nom = feature?.properties?.NOM || 'Secteur';
          lyr.bindTooltip(nom, { sticky: true, direction: 'top', className: 'leaflet-tooltip-custom' });
          lyr.on('mouseover', () => lyr.setStyle(highlightStyle));
          lyr.on('mouseout', () => lyr.setStyle(baseStyle));
          lyr.on('click', () => {
            const key = String(nom).trim().toLowerCase();
            const info = index.get(key);
            const popFmt = (v) => (typeof v === 'number' && v.toLocaleString) ? v.toLocaleString('fr-FR') : (v ?? '');
            const popLine = (info && info.population) ? `<br/>Habitants: <strong>${popFmt(info.population)}</strong>${info.annee ? ` <small>(réf. ${info.annee})</small>` : ''}` : '';
            lyr.bindPopup(`<strong>${nom}</strong>${popLine}`).openPopup();
          });
        }
      }).addTo(map);

      polygonsLayer.eachLayer(l => { l.getElement?.()?.style && (l.getElement().style.cursor = 'pointer'); });

      try {
        const bounds = polygonsLayer.getBounds();
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
        map.whenReady(() => setTimeout(() => map.invalidateSize(), 0));
      } catch (_) {
        map.setView([48.787, -0.197], 12);
      }

      // close data+polygons try
      } catch (_) {}

      // ZAE overlay (EPSG:2154 -> 4326)
      try {
        map.createPane('overlays');
        map.getPane('overlays').style.zIndex = 645;

        const zae = await fetch('/assets/datas/geojson/ZAE.geojson').then(r => r.json());
        if (!zae) return;

        proj4.defs('EPSG:2154', '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +units=m +no_defs');
        const from = proj4('EPSG:2154');
        const to = proj4('EPSG:4326');
        function tCoords(c){ if(typeof c[0]==='number'){ const [x,y]=c; const [lon,lat]=proj4(from,to,[x,y]); return [lon,lat]; } return c.map(tCoords); }
        function tGeom(g){ return { ...g, coordinates: tCoords(g.coordinates) }; }
        const zaeWgs = (zae.type==='FeatureCollection') ? { ...zae, features: zae.features.map(f=>({ ...f, geometry: tGeom(f.geometry) })) } : zae;

        const zaeStyle = { color: SECONDARY(), weight: 1.5, opacity: 0.9, fillColor: PRIMARY(), fillOpacity: 0.2 };
        zaeLayer = L.geoJSON(zaeWgs, {
          style: () => zaeStyle,
          pane: 'overlays',
          bubblingMouseEvents: false,
          onEachFeature: (f, lyr) => {
            const p = f.properties || {};
            const title = p.TOPONYME || p.NATURE || p.CATEGORIE || 'Élément';
            const iconPath = iconPathForCategory(p.CATEGORIE || '');
            const iconOnly = `<img src="${iconPath}" alt="" class="zae-label-icon"/>`;
            const withText = `${iconOnly}<span class="zae-label-text">${title}</span>`;
            lyr.bindTooltip(iconOnly, { permanent: true, direction: 'center', className: 'leaflet-label-zae', interactive: true });
            const attachTooltipClick = () => {
              const tt = lyr.getTooltip?.();
              const el = tt?.getElement?.();
              if (el && !el._zaeBound) {
                el._zaeBound = true;
                el.addEventListener('click', (e) => { e.stopPropagation(); lyr.openPopup(); });
                el.addEventListener('mousedown', (e) => e.stopPropagation());
                el.addEventListener('dblclick', (e) => e.stopPropagation());
              }
            };
            setTimeout(attachTooltipClick, 0);
            lyr.on('tooltipopen', attachTooltipClick);
            lyr.on('mouseover', () => { const t = lyr.getTooltip?.(); if (t) t.setContent(withText); });
            lyr.on('mouseout', () => { const t = lyr.getTooltip?.(); if (t) t.setContent(iconOnly); });
            lyr.bindPopup(`<strong>${title}</strong>`);
            lyr.featureCategory = p.CATEGORIE || 'Autres';
          }
        }).addTo(map);

        // Build categories and initialize filter
        const catSet = new Set();
        zaeWgs.features.forEach(f => { const c = f.properties?.CATEGORIE; if (c) catSet.add(c); });
        categories = Array.from(catSet).sort();
        activeCategories = new Set(categories);
        applyZaeFilter();
      } catch (_) {}
    } catch (_) {
      try { map?.setView([48.787, -0.197], 11); } catch {}
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', setMapSectionHeight);
    }
  });
  </script>

 

<section class="map-section with-sidebar">
  <SidebarZAE
    {categories}
    bind:opened={sidebarOpened}
    on:filter={onFilterChange}
    on:toggle={onToggle}
  />
  <div bind:this={mapEl} class="map-container" aria-label="Carte des communes déléguées"></div>
  <button class="fab" aria-label="Ouvrir les filtres" onclick={onToggle}>🔍 Filtres</button>
  
</section>

<style>
  :global(html, body) {
    height: 100%;
    overflow: hidden;
  }
  :global(main) {
    margin: 0;
    max-width: none;
    padding: 0;
    height: 100dvh;
  }
  .map-section {
    max-width: none;
    margin: 0;
    padding: 0 0.75rem;
    position: relative;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 0.75rem;
    height: 100dvh;
    min-height: 70vh;
    align-items: stretch;
  }
  .map-container {
    width: 100%;
    height: 100%;
    min-height: 420px;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    background: #fff;
  }
  .fab {
    position: absolute;
    right: 1.25rem;
    bottom: 1.25rem;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: 999px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    padding: .6rem 1rem;
    cursor: pointer;
    display: none;
    z-index: 705;
    font-weight: 600;
  }

  /* Harmonize tooltips with theme */
  :global(.leaflet-tooltip-custom) {
    background: #fff;
    color: var(--secondary);
    border: 1px solid rgba(46, 139, 87, 0.3);
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    border-radius: 6px;
    font-family: var(--font-main);
    font-weight: 500;
    font-size: 0.95rem;
  }
  :global(.leaflet-label-zae) {
    background: rgba(255,255,255,0.85);
    color: var(--secondary);
    border: 1px solid rgba(27,54,93,0.25);
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    font-family: var(--font-main);
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
  }
  :global(.leaflet-label-zae .leaflet-tooltip-content) { margin: 0; padding: 0; line-height: 1; }
  :global(.leaflet-label-zae .zae-label-icon) { width:22px; height:22px; display:block; }
  :global(.leaflet-label-zae .zae-label-text) { margin-left:.35rem; }

  /* Upsize Leaflet controls for better touch targets */
  :global(.leaflet-bar a) { width: 36px; height: 36px; line-height: 36px; font-size: 18px; }
  :global(.leaflet-control-zoom-in),
  :global(.leaflet-control-zoom-out) { font-weight: 700; }
  :global(.leaflet-popup-content) { font-size: 0.95rem; }

  @media (max-width: 768px) {
    .map-section { grid-template-columns: 1fr; height: calc(100dvh - 80px); padding: 0; }
    .map-container { height: 100%; }
    .fab { display: inline-flex; align-items:center; gap:.4rem; }
  }
</style>

