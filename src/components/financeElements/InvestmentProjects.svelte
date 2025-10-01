<script>
  import InvestmentProjectCard from './InvestmentProjectCard.svelte';
  import DonutChart from './DonutChart.svelte';
  import HorizontalBarChart from './HorizontalBarChart.svelte';
  import '../../styles/modal.css';
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

  async function load() {
    error = '';
    projects = [];
    try {
      const res = await fetch(`/assets/datas/${year}/table_operations_${year}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      projects = Array.isArray(data) ? data.slice().sort((a, b) => {
        const ra = Number(a?.realise_dep ?? 0);
        const rb = Number(b?.realise_dep ?? 0);
        return rb - ra; // plus grand réalisé en premier
      }) : [];

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
        for (const row of (Array.isArray(bdata) ? bdata : [])) {
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
            }
          }
        }
        codesWithData = new Set(Array.from(map.entries()).filter(([, sum]) => sum > 0).map(([k]) => k));
      } catch (_) {
        codesWithData = new Set();
        codeSums = new Map();
      }
    } catch (e) {
      error = `Impossible de charger les projets (${e.message})`;
    }
  }

  load();

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
          hasBudgetData={true}
          computedPrev={(codeSums.get(p.code)?.prev) || 0}
          computedReal={(codeSums.get(p.code)?.real) || 0}
          on:details={openDetails}
        />
      {/each}
    </div>
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
  .compare { display:flex; flex-direction:column; gap:.75rem; }
  .compare .row { display:grid; grid-template-columns: 120px 1fr auto; gap:.75rem; align-items:center; }
  .compare .bar { height: 12px; background: var(--gray-light); border-radius:999px; overflow:hidden; }
  .compare .fill { height:100%; }
  .compare .fill.prev { background: #1b365d; }
  .compare .fill.real { background: var(--primary); }
  .compare .label { color: var(--secondary); font-weight:600; }
  .compare .val { color: var(--secondary); font-weight:600; }
</style>


