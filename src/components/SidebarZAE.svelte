<script>
  import { createEventDispatcher } from 'svelte';
  import { iconPathForCategory } from '../utils/zae-icons.ts';
  let { categories = [], opened = $bindable(false), interco = $bindable(false) } = $props();

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
      <h3>Équipements et lieux d’intérêt de Putanges‑le‑Lac</h3>
      <div id="zae-categories">
        {#each categories as label}
          <label class="cat-item">
            <input type="checkbox" value={label} checked onchange={onChange} />
            <img class="cat-icon" alt="" src={iconPathForCategory(label)} />
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
  .cat-item .cat-icon { width: 18px; height: 18px; opacity:.9; }

  @media (max-width: 768px) {
    .sidebar { position:absolute; left:1rem; right:1rem; top:0; height:auto; max-height:60vh; transform: translateY(-110%); transition: transform .2s ease; z-index: 700; }
    .sidebar.open { transform: translateY(0); }
  }
</style>

