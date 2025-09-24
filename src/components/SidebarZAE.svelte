<script>
  import { onMount } from 'svelte';
  export let categories = [];
  export let opened = false;

  function toggleOpen() {
    opened = !opened;
    window.dispatchEvent(new CustomEvent('zae:toggle', { detail: { opened } }));
  }

  function onChange() {
    const container = document.getElementById('zae-categories');
    const actives = new Set(Array.from(container.querySelectorAll('input[type="checkbox"]'))
      .filter(i => i.checked).map(i => i.value));
    window.dispatchEvent(new CustomEvent('zae:filter', { detail: { actives } }));
  }

  onMount(() => {
    const handler = (e) => {
      const next = e?.detail?.categories || [];
      categories = next;
      requestAnimationFrame(() => onChange());
    };
    window.addEventListener('zae:mount', handler);
    return () => window.removeEventListener('zae:mount', handler);
  });
</script>

<aside class:open={opened} class="sidebar">
  <header class="sidebar-header">
    <button on:click={toggleOpen} aria-label="Ouvrir/fermer le filtre">☰</button>
    <h2>Filtres</h2>
  </header>
  <div class="sidebar-body">
    <div class="filter-group">
      <h3>Catégories</h3>
      <div id="zae-categories">
        {#each categories as label}
          <label class="cat-item">
            <input type="checkbox" value={label} checked on:change={onChange} />
            <span>{label}</span>
          </label>
        {/each}
      </div>
    </div>
  </div>
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

  @media (max-width: 768px) {
    .sidebar { position:absolute; left:1rem; right:1rem; top:0; height:auto; max-height:60vh; transform: translateY(-110%); transition: transform .2s ease; z-index: 700; }
    .sidebar.open { transform: translateY(0); }
  }
</style>

