<script>
  import { onMount, createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  let docs = [];
  let grouped = {};
  let years = [];
  let expandedYears = new Set();

  onMount(async () => {
    try {
      const res = await fetch('/assets/datas/ocr_index.json');
      if (res.ok) {
        docs = await res.json();
        grouped = docs.reduce((acc, d) => {
          (acc[d.year] = acc[d.year] || []).push(d);
          return acc;
        }, {});
        years = Object.keys(grouped).sort((a, b) => b - a);
      }
    } catch (e) {
      console.error('[DocumentArborescence] erreur chargement index', e);
    }
  });

  function toggleYear(y) {
    const next = new Set(expandedYears);
    if (next.has(y)) next.delete(y);
    else next.add(y);
    expandedYears = next;
  }

  function handleDocumentClick(doc) {
    const withUrl = { ...doc, path: `/assets/datas/CR-municipaux/${doc.file}` };
    console.log('🔍 DocumentArborescence - Clic sur document:', withUrl.path);
    dispatch('documentSelected', { doc: withUrl });
    
    // Fallback : événement global si dispatch ne fonctionne pas
    const globalEvent = new CustomEvent('documentSelected', { 
      detail: { doc: withUrl },
      bubbles: true 
    });
    document.dispatchEvent(globalEvent);
    console.log('🔍 DocumentArborescence - Événement global envoyé');
  }

  function label(doc) {
    if (doc.eventDate) {
      try {
        const d = new Date(doc.eventDate);
        return 'Compte rendu du ' + d.toLocaleDateString('fr-FR');
      } catch {}
    }
    return doc.file;
  }
</script>

<div class="document-arborescence">
  <div class="arborescence-header">
    <h2 class="arborescence-title">📋 Comptes-rendus municipaux</h2>
  </div>
  
  <div class="arborescence-content">
    {#if years.length === 0}
      <p class="loading-text">Chargement des documents...</p>
    {:else}
      {#each years as y}
        <div class="year-group">
          <button class="year-button" on:click={() => toggleYear(y)}>
            <span class="year-icon">{expandedYears.has(y) ? '📂' : '📁'}</span> 
            <span class="year-text">{y}</span>
            <span class="year-count">({grouped[y].length})</span>
          </button>
          {#if expandedYears.has(y)}
            <ul class="documents-list">
              {#each grouped[y] as doc}
                <li>
                  <button 
                    class="document-button" 
                    on:click={() => handleDocumentClick(doc)}
                    title={doc.path}
                  >
                    📄 {label(doc)}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .document-arborescence {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-right: 1px solid #e5e7eb;
  }

  .arborescence-header {
    padding: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }

  .arborescence-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--primary);
    font-family: var(--font-main);
  }

  .arborescence-subtitle {
    font-size: 0.9rem;
    color: var(--secondary);
    opacity: 0.8;
    margin: 0;
    line-height: 1.4;
  }

  .arborescence-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .loading-text {
    text-align: center;
    color: #6b7280;
    font-style: italic;
    margin: 2rem 0;
  }

  .year-group {
    margin-bottom: 0.5rem;
  }

  .year-button {
    display: flex;
    align-items: center;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: var(--secondary);
    transition: background-color 0.2s ease;
  }

  .year-button:hover {
    background-color: rgba(46, 139, 87, 0.1);
  }

  .year-icon {
    margin-right: 0.75rem;
    font-size: 1.1rem;
  }

  .year-text {
    font-weight: 600;
    flex: 1;
  }

  .year-count {
    font-size: 0.8rem;
    color: var(--primary);
    background-color: rgba(46, 139, 87, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 0.75rem;
    font-weight: 500;
  }

  .documents-list {
    list-style: none;
    margin: 0;
    padding: 0 0 0 2.5rem;
  }

  .documents-list li {
    margin-bottom: 0.25rem;
  }

  .document-button {
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    color: var(--primary);
    border-radius: 0.25rem;
    transition: all 0.2s ease;
    line-height: 1.4;
  }

  .document-button:hover {
    background-color: rgba(46, 139, 87, 0.1);
    color: var(--primary-dark);
    transform: translateX(2px);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .arborescence-header {
      padding: 1rem;
    }

    .arborescence-title {
      font-size: 1.1rem;
    }

    .arborescence-subtitle {
      font-size: 0.8rem;
    }

    .year-button {
      padding: 0.5rem;
    }

    .document-button {
      font-size: 0.85rem;
    }
  }
</style> 