<script>
  import InvestmentProjectCard from './InvestmentProjectCard.svelte';
  import DonutChart from './DonutChart.svelte';
  import HorizontalBarChart from './HorizontalBarChart.svelte';
  import '../../styles/modal.css';
  import { onMount } from 'svelte';
  
  export let year = '2024';
  let projects = [];
  let error = '';
  let isOpen = false;
  let modalTitle = '';
  let donutData = [];
  let codesWithData = new Set();
  let activeTab = 'repartition'; // 'repartition' | 'compare'
  let totalPrev = 0;
  let totalReal = 0;
  let barData = [];
  let codeSums = new Map(); // code -> { prev: number, real: number }
  // Autres dépenses (non rattachées à une opération)
  let otherOpen = false;
  let otherBarData = [];

  async function load() {
    error = '';
    projects = [];
    try {
      const res = await fetch(`/assets/datas/${year}/table_operations_${year}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      projects = Array.isArray(data) ? data.slice() : [];

      // Pré-calculer la présence de données côté budget de base
      try {
        const bres = await fetch(`/assets/datas/${year}/base_budget_${year}.json`);
        const bdata = await bres.json();
        const map = new Map();
        codeSums = new Map();
        for (const p of projects) {
          map.set(p.code, 0);
          codeSums.set(p.code, { prev: 0, real: 0 });
        }
        // Préparer agrégation pour les "autres dépenses" avec libellés vulgarisés
        const otherMap = new Map(); // libelle_vulgarise -> { label, prevus_2024, realises_2024, propositions_2025 }

        for (const row of (Array.isArray(bdata) ? bdata : [])) {
          if (row.SECTION !== 'INVESTISSEMENT' || row['DÉPENSES/RECETTES'] !== 'DEPENSES') {
            continue;
          }
          const c = typeof row?.COMPTE === 'string' ? row.COMPTE : '';
          const dash = c.lastIndexOf('-');
          if (dash > -1) {
            const op = c.slice(dash + 1);
            if (map.has(op)) {
              const val = Number(row?.REALISATIONS_2024 ?? 0);
              map.set(op, (map.get(op) || 0) + (isNaN(val) ? 0 : val));
              const prev = Number(row?.PREVISIONS_2024 ?? 0) || 0;
              const sums = codeSums.get(op) || { prev: 0, real: 0 };
              sums.prev += prev;
              sums.real += isNaN(val) ? 0 : val;
              codeSums.set(op, sums);
            } else {
              // suffix non reconnu -> autres dépenses (seulement si libellé vulgarisé existe)
              aggregateOtherExpenses(row, otherMap);
            }
          } else {
            // Pas de code d'opération dans COMPTE -> autres dépenses (seulement si libellé vulgarisé existe)
            aggregateOtherExpenses(row, otherMap);
          }
        }
        codesWithData = new Set(Array.from(map.entries()).filter(([, sum]) => sum > 0).map(([k]) => k));
        otherBarData = Array.from(otherMap.values()).filter(d => (d.prevus_2024||0) > 0 || (d.realises_2024||0) > 0 || (d.propositions_2025||0) > 0)
          .sort((a,b)=> (b.realises_2024||0) - (a.realises_2024||0));
      } catch (_) {
        codesWithData = new Set();
        codeSums = new Map();
        otherBarData = [];
      }
    } catch (e) {
      error = `Impossible de charger les projets (${e.message})`;
    }
  }

  // Fonction utilitaire pour agréger les autres dépenses
  function aggregateOtherExpenses(row, otherMap) {
    if (row.libelle_vulgarise) {
      const key = row.libelle_vulgarise;
      const acc = otherMap.get(key) || { label: key, prevus_2024: 0, realises_2024: 0, propositions_2025: 0 };
      acc.prevus_2024 += Number(row?.PREVISIONS_2024 || 0) || 0;
      acc.realises_2024 += Number(row?.REALISATIONS_2024 || 0) || 0;
      acc.propositions_2025 += Number(row?.PROPOSITIONS_2025 || 0) || 0;
      otherMap.set(key, acc);
    }
  }

  onMount(() => load());

  async function openDetails(e) {
    const { code, libelle } = e.detail || {};
    modalTitle = libelle || `Opération ${code}`;
    isOpen = true;
    activeTab = 'repartition';
    try {
      const res = await fetch(`/assets/datas/${year}/base_budget_${year}.json`);
      const data = await res.json();
      const items = Array.isArray(data) ? data.filter(r => r.SECTION === 'INVESTISSEMENT' && typeof r.COMPTE === 'string' && r.COMPTE.endsWith(`-${code}`)) : [];
      // agréger par LIBELLE (intitulé de la ligne budgétaire)
      const map = new Map();
      totalPrev = 0; totalReal = 0;
      const barMap = new Map();
      for (const it of items) {
        const key = it.LIBELLE || 'Autres';
        const val = Number(it.REALISATIONS_2024 || 0);
        map.set(key, (map.get(key) || 0) + val);
        totalPrev += Number(it.PREVISIONS_2024 || 0) || 0;
        totalReal += val || 0;
        // accumulate bar data
        const prev = Number(it.PREVISIONS_2024 || 0) || 0;
        const prop = Number(it.PROPOSITIONS_2025 || 0) || 0;
        const acc = barMap.get(key) || { label: key, prevus_2024: 0, realises_2024: 0, propositions_2025: 0 };
        acc.prevus_2024 += prev;
        acc.realises_2024 += val;
        acc.propositions_2025 += prop;
        barMap.set(key, acc);
      }
      donutData = Array.from(map.entries()).map(([label, value]) => ({ label, value })).filter(d => d.value > 0);
      barData = Array.from(barMap.values()).sort((a,b)=> (b.realises_2024||0) - (a.realises_2024||0));
    } catch (err) {
      donutData = [];
      barData = [];
    }
  }

  function closeModal(){ isOpen = false; }
</script>

<section class="projects-section">
  <h2>Projets d'investissement 2024</h2>
  {#if error}
    <p>{error}</p>
  {:else}
    <div class="projects-grid">
      {#each projects.filter(p => codesWithData.has(p.code)) as p (p.code)}
        <InvestmentProjectCard
          {...p}
          computedPrev={(codeSums.get(p.code)?.prev) || 0}
          computedReal={(codeSums.get(p.code)?.real) || 0}
          on:details={openDetails}
        />
      {/each}
    </div>

    <!-- Accordéon: Autres dépenses d'investissement (non rattachées à une opération) -->
    <div  id="accordion-investissement-autres">
        <div class="cta-container">
          <button class="cta" onclick={() => otherOpen = !otherOpen} aria-expanded={otherOpen}>
            <span class="cta-text">{otherOpen ? 'Masquer' : 'Explorer'} les autres dépenses d'investissement hors projets</span>
            <svg class="cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {#if otherOpen}
        <div class="accordion-content">
          <HorizontalBarChart data={otherBarData} chartId={`bar-investissements-autres-${year}`} />
        </div>
      {/if}
  {/if}
</section>

{#if isOpen}
  <div class="modal-overlay" onclick={closeModal}>
    <div class="modal-content drilldown" onclick={(e)=>e.stopPropagation()}>
      <div class="modal-header light">
        <h2 class="modal-title">{modalTitle}</h2>
        <button class="modal-close light" onclick={closeModal} aria-label="Fermer">×</button>
      </div>
      <div class="modal-body">
        <div class="tabs">
          <button class:active={activeTab==='repartition'} onclick={() => activeTab='repartition'}>Répartition des dépenses</button>
          <button class:active={activeTab==='compare'} onclick={() => activeTab='compare'}>Prévu vs réalisé</button>
        </div>

        {#if activeTab === 'repartition'}
          <DonutChart data={donutData} title="Dépenses réalisées par libellé" chartId={`op-${year}-${modalTitle}`} />
        {:else}
          <HorizontalBarChart data={barData} chartId={`bar-${year}-${modalTitle}`} />
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .projects-section { margin: 4rem 0; }
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
  h2 { color: var(--primary); font-family: var(--font-main); font-weight: 600; display:flex; align-items:center; gap:1rem; }
  @media (max-width: 768px) { .projects-grid { grid-template-columns: 1fr; } }

  .tabs { display:flex; gap:.5rem; margin-bottom: 1rem; }
  .tabs button { background:#fff; border:1px solid var(--primary); color: var(--primary); padding:.4rem .8rem; border-radius:.5rem; font-weight:600; cursor:pointer; }
  .tabs button.active, .tabs button:hover { background: var(--primary); color:#fff; }

  #accordion-investissement-autres {
    margin-top: 2rem;
  }

  /* Styles des accordéons (copiés de FinancesPage.svelte) */
  .accordion-wrapper {
    margin-top: 2rem;
    background: #f8fafc;
    border-radius: 1rem;
    padding: 2rem;
    border-left: 4px solid var(--secondary);
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);
  }

  .accordion-header {
    text-align: center;
    margin-bottom: 1rem;
  }


  .cta-container {
    display: flex;
    justify-content: center;
  }

  .cta {
    background: white;
    color: var(--primary);
    border: 1px solid var(--primary);
    box-shadow: 0 4px 12px rgba(46, 139, 87, 0.3);
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    margin: 0 1rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }

  .cta:hover {
    background: var(--primary);
    color: white;
  }

  .cta-icon {
    transition: transform 0.3s ease;
  }

  .cta[aria-expanded="true"] {
    background: var(--primary);
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(46, 139, 87, 0.3);
  }

  .cta[aria-expanded="true"] .cta-icon {
    transform: rotate(180deg);
  }

  .accordion-content {
    padding: 2rem;
    border-top: 1px solid rgba(46, 139, 87, 0.1);
  }

  @media (max-width: 768px) {
    .cta-container {
      flex-direction: column;
      align-items: center;
    }

    .cta {
      margin: 0.5rem 0;
      padding: 0.75rem 1rem;
    }
  }
</style>


