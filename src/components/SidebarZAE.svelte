<script>
  import { createEventDispatcher } from 'svelte';
  import { iconPathForCategory } from '../utils/zae-icons.ts';
  import ArrowIcon from './commonsElements/ArrowIcon.svelte';
  let { categories = [], opened = $bindable(false), interco = $bindable(false), rivers = $bindable(false), vegCategories = [], vegColors = {} } = $props();

  // Accordions state
  let openEquip = $state(true);
  let openNature = $state(false);

  const dispatch = createEventDispatcher();

  function toggleOpen() {
    opened = !opened;
    // Svelte event for parent components
    dispatch('toggle', { opened });
    // Backward-compatible window event
    // (à supprimer quand plus nécessaire)
    window.dispatchEvent(new CustomEvent('zae:toggle', { detail: { opened } }));
  }

  function onChange() {
    const container = document.getElementById('zae-categories');
    const actives = new Set(Array.from(container.querySelectorAll('input[type="checkbox"]'))
      .filter(i => i.checked).map(i => i.value));
    // Svelte event for parent components
    dispatch('filter', { actives });
    // Backward-compatible window event
    // (à supprimer quand plus nécessaire)
    window.dispatchEvent(new CustomEvent('zae:filter', { detail: { actives } }));
  }

  function onToggleInterco() {
    // bind:checked already updated `interco`; just notify parent
    dispatch('layer', { interco });
    window.dispatchEvent(new CustomEvent('zae:layer', { detail: { interco } }));
  }

  function onToggleRivers() {
    // bind:checked already updated `rivers`; just notify parent if needed later
    dispatch('rivers', { rivers });
    window.dispatchEvent(new CustomEvent('zae:rivers', { detail: { rivers } }));
  }

  function onVegChange() {
    const container = document.getElementById('veg-categories');
    const actives = new Set(Array.from(container?.querySelectorAll('input[type="checkbox"]') || [])
      .filter(i => i.checked).map(i => i.value));
    dispatch('vegFilter', { actives });
    window.dispatchEvent(new CustomEvent('zae:vegFilter', { detail: { actives } }));
  }

  // categories sont passées par props; plus besoin d'événements window ici
</script>

<aside class:open={opened} class="sidebar">
  <header class="sidebar-header">
    <button onclick={toggleOpen} aria-label="Ouvrir/fermer le filtre">☰</button>
    <h2>Filtres</h2>
  </header>
  <div class="sidebar-body">
    <div class="filter-group">
      <label class="cat-item">
        <input type="checkbox" bind:checked={interco} onchange={onToggleInterco} />
        <span>CdC du Val d'Orne</span>
      </label>
    </div>
  
    <div class="filter-group">
      <div class="accordion {openEquip ? 'open' : ''}">
        <button type="button" class="accordion-summary" aria-expanded={openEquip} onclick={() => openEquip = !openEquip}>
          <ArrowIcon color="var(--secondary)" size={14} direction={openEquip ? 'down' : 'right'} />
          <h3>Équipements et lieux d’intérêt de Putanges‑le‑Lac</h3>
        </button>
        <div class="accordion-content"><div class="accordion-inner">
          <div id="zae-categories">
            {#each categories as label}
              <label class="cat-item">
                <input type="checkbox" value={label} checked onchange={onChange} />
                <img class="cat-icon" alt="" src={iconPathForCategory(label)} />
                <span>{label}</span>
              </label>
            {/each}
          </div>
        </div></div>
      </div>

    {#if vegCategories?.length}
    <div class="filter-group">
      <div class="accordion {openNature ? 'open' : ''}">
        <button type="button" class="accordion-summary" aria-expanded={openNature} onclick={() => openNature = !openNature}>
          <ArrowIcon color="var(--secondary)" size={14} direction={openNature ? 'down' : 'right'} />
          <h3>Élements naturels</h3>
        </button>
        <div class="accordion-content"><div class="accordion-inner">
          <div id="veg-categories">
            <label class="cat-item">
              <input type="checkbox" bind:checked={rivers} onchange={onToggleRivers} />
              <span>Rivières</span>
            </label>
            {#each vegCategories as label}
              <label class="cat-item">
                <input type="checkbox" value={label} onchange={onVegChange} />
                <span class="legend-chip" style={`--chip:${vegColors[label] || '#999'}`}></span>
                <span>{label}</span>
              </label>
            {/each}
          </div>
        </div></div>
      </div>
    </div>
  {/if}
    </div>
    
  </div>
  <footer class="sidebar-footer">
    <small>
      Données issues de <a href="https://geoservices.ign.fr/bdtopo" target="_blank" rel="noopener noreferrer">BD TOPO – IGN</a>    
    </small>
    <br />
    <small>Mise à jour: juin 2025.</small>
    <div class="contrib-box">
      <small>
        Une donnée est manquante ou erronée ? Vous souhaitez proposer de nouvelles couches ?
       <a href="mailto:contact@mccputanges.fr?subject=Contribution%20donn%C3%A9es%20cartographiques">Envoyez-nous vos suggestions par mail.</a>
      </small>
    </div>
  </footer>
</aside>

<style>
  .sidebar {
    background: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.06);
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .sidebar-header {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .5rem .75rem;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  .sidebar-header h2 { font-size: 1rem; margin: 0; }
  .sidebar-header button { background: var(--primary); color:#fff; border:none; border-radius:.5rem; padding:.3rem .5rem; cursor:pointer; }
  .sidebar-body { padding: .75rem; overflow:auto; }
  .filter-group h3 { margin:.25rem 0 .5rem; font-size:.95rem; color: var(--secondary); }
  .cat-item { display:flex; align-items:center; gap:.5rem; margin:.25rem 0; font-size:.95rem; }
  .cat-item .cat-icon { width: 18px; height: 18px; opacity:.9; }
  .legend-chip { width: 12px; height: 12px; border-radius: 2px; background: var(--chip, #999); display:inline-block; border:1px solid rgba(0,0,0,0.25); }
  .accordion { border-top: 2px solid rgba(0,0,0,0.06);  padding:.75rem .5rem;  }
  .accordion-summary { list-style:none; cursor:pointer; display:flex; align-items:center; gap:.4rem; background:none; border:none; padding:0; width:100%; text-align:left; }
  .accordion-summary::-webkit-details-marker { display:none; }
  .accordion h3 { margin:.25rem 0; font-size:.95rem; color: var(--secondary); }
  .accordion-content { overflow: hidden; transition: grid-template-rows .2s ease, opacity .2s ease; display: grid; grid-template-rows: 0fr; opacity: 0; }
  .accordion.open .accordion-content { grid-template-rows: 1fr; opacity: 1; }
  .accordion-inner { min-height: 0; }
  .sidebar-footer { padding: .5rem .75rem; border-top: 1px solid rgba(0,0,0,0.06); color:#555; }
  .sidebar-footer a { color: var(--secondary); text-decoration: underline; }
  .contrib-box { margin-top:.4rem; padding:.35rem .5rem; background:#f7f8f9; border:1px solid rgba(0,0,0,0.06); border-radius:.5rem; }
  .contrib-box small { line-height:1.2; display:block; font-size:.85rem; }

  @media (max-width: 768px) {
    .sidebar { position:absolute; left:1rem; right:1rem; top:0; height:auto; max-height:60vh; transform: translateY(-110%); transition: transform .2s ease; z-index: 700; }
    .sidebar.open { transform: translateY(0); }
  }
</style>

