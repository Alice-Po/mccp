<script>
  import InvestmentProjectCard from './InvestmentProjectCard.svelte';
  export let year = '2025';
  let projects = [];
  let error = '';

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
    } catch (e) {
      error = `Impossible de charger les projets (${e.message})`;
    }
  }

  load();
</script>

<section class="projects-section">
  <h2>Projets d'investissement {year}</h2>
  {#if error}
    <p>{error}</p>
  {:else}
    <div class="projects-grid">
      {#each projects as p (p.code)}
        <InvestmentProjectCard {...p} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .projects-section { margin: 4rem 0; }
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
  h2 { color: var(--primary); font-family: var(--font-main); font-weight: 600; display:flex; align-items:center; gap:1rem; }
  @media (max-width: 768px) { .projects-grid { grid-template-columns: 1fr; } }
</style>


