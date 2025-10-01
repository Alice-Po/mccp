<script>
  export let code = '';
  export let libelle = '';
  export let budget_dep = 0;
  export let realise_dep = 0;

  const fmt = (n) => {
    if (typeof n !== 'number' || isNaN(n)) return '';
    return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const percent = () => {
    if (!budget_dep) return 0;
    return Math.round((realise_dep / budget_dep) * 100);
  };
  const basePercent = () => Math.max(0, Math.min(100, percent()));
  const overflowPercent = () => Math.max(0, Math.min(100, percent() - 100));
</script>

<article class="project-card">
  <header class="project-header">
    <h3>{libelle}</h3>
    <span class="project-code">Code opération: {code}</span>
    <p class="project-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dui massa, semper in placerat eget, iaculis eu justo.</p>
  </header>
  <div class="project-body">
    <div class="amounts">
      <div class="amount"><strong>Budget dépensé prévu</strong><span>{fmt(budget_dep)} €</span></div>
      <div class="amount"><strong>Réalisé</strong><span>{fmt(realise_dep)} €</span></div>
    </div>
    <div class="progress">
      <div class="bar"><div class="fill" style={`width:${basePercent()}%`}></div></div>
      <div class="ratio">{percent()}% d'exécution</div>
    </div>
    {#if overflowPercent() > 0}
      <div class="overflow">
        <div class="bar bar-over"><div class="fill over" style={`width:${overflowPercent()}%`}></div></div>
        <div class="ratio over-text">+{overflowPercent()}% dépassement</div>
      </div>
    {/if}
  </div>
</article>

<style>
  .project-card {
    border: 1px solid #eaeaea;
    border-radius: 1rem;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .project-header { display: flex; flex-direction: column; gap: .25rem; }
  .project-header h3 { font-size: 1.2rem; color: var(--secondary); margin: 0; font-family: var(--font-main); font-weight: 600; }
  .project-code { font-size: .9rem; color: var(--secondary); opacity: .7; }
  .project-desc { margin: .25rem 0 0; color: var(--secondary); opacity: .85; font-size: .95rem; line-height: 1.4; }
  .project-body { display: flex; flex-direction: column; gap: .75rem; }
  .amounts { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 1rem; }
  .amount { background: rgba(46,139,87,0.06); border-radius: .5rem; padding: .75rem; display:flex; flex-direction:column; gap:.25rem; }
  .amount strong { background: rgba(46, 139, 87, 0.1); padding: 0.1rem 0.25rem; border-radius: 0.25rem; font-size: .95rem; }
  .amount span { font-size: 1.1rem; color: var(--secondary); }
  .progress { display:flex; align-items:center; gap:.75rem; }
  .bar { flex:1; height: 10px; background: var(--gray-light); border-radius: 999px; overflow:hidden; }
  .fill { height: 100%; background: var(--primary); }
  .ratio { font-size: .95rem; color: var(--secondary); }
  .overflow { display:flex; align-items:center; gap:.75rem; margin-top:.25rem; }
  .bar-over { height: 8px; }
  .fill.over { background: #c0392b; }
  .ratio.over-text { color:#c0392b; font-weight:600; }

  @media (max-width: 768px) { .amounts { grid-template-columns: 1fr; } }
</style>


