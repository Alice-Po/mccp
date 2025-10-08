<script>
  import { createEventDispatcher } from 'svelte';
  
  let { title, isOpen = false, referenceData: referenceDataProp = null } = $props();
  
  const dispatch = createEventDispatcher();
  
  function toggle() {
    dispatch('toggle', { title, isOpen: !isOpen });
  }
  
  let showReference = $state(false);
  let referenceData = $state(null);
  
  function toggleReference() {
    showReference = !showReference;
  }
  
  // Réception des données depuis le parent uniquement (pas de fetch ici)
  $effect(() => {
    referenceData = referenceDataProp ?? null;
  });
</script>

<div class="competence-section" id="content-{title}">
  <button 
    class="competence-header" 
    class:open={isOpen}
    onclick={toggle}
    aria-expanded={isOpen}
    aria-controls="content-{title}"
  >
    <h3>{title}</h3>
    <svg 
      class="toggle-icon" 
      style="transform: {isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}"
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>
  
  {#if isOpen}
    <div class="competence-content">
      <div class="competence-inner">
        <p>
          Un travail est en cours pour adapter le texte officiel décrivant les compétences
          de la commune sur cette thématique à la situation particulière de Putanges-le-Lac
          et de la Communauté de communes du Val d'Orne.
        </p>

        <div class="reference-accordion">
          <button class="reference-header" type="button" onclick={toggleReference} aria-expanded={showReference}>
            <span>Texte de référence</span>
            <svg 
              class="toggle-icon" 
              style="transform: {showReference ? 'rotate(180deg)' : 'rotate(0deg)'}"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="reference-content" style="display: {showReference ? 'block' : 'none'};">
            {#if referenceData}
              {#each Object.entries(referenceData) as [section, content]}
                <h4>{section} :</h4>
                {#if Array.isArray(content)}
                  <ul>
                    {#each content as item}
                      <li>{item}</li>
                    {/each}
                  </ul>
                {:else}
                  {#if typeof content === 'string'}
                    <p>{content}</p>
                  {/if}
                {/if}
              {/each}
            {:else}
              <p>Aucune donnée disponible.</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .competence-section {
    border: 1px solid #eaeaea;
    border-radius: 1rem;
    margin-bottom: 1.5rem;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .competence-header {
    width: 100%;
    padding: 1.5rem;
    background: white;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    transition: all 0.2s ease;
    position: relative;
    border-bottom: 1px solid #eaeaea;
  }
  
  .competence-header:hover {
    background-color: rgba(46, 139, 87, 0.05);
  }
  
  .competence-header h3 {
    margin: 0;
    font-size: 1.4rem;
    color: var(--secondary);
    font-family: var(--font-main);
    font-weight: 600;
  }
  
  .toggle-icon {
    color: var(--primary);
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }
  
  
  .competence-content {
    overflow: hidden;
    transition: all 0.3s ease;
    border-top: 1px solid #eaeaea;
  }
  
  .competence-inner {
    padding: 1.5rem;
    color: var(--secondary);
    line-height: 1.6;
  }
  
  .competence-inner :global(h4) {
    font-size: 1.2rem;
    color: var(--primary);
    margin: 1.5rem 0 0.8rem 0;
    font-family: var(--font-main);
    font-weight: 600;
  }
  
  .competence-inner :global(h4:first-child) {
    margin-top: 0;
  }
  
  .competence-inner :global(h5) {
    font-size: 1.1rem;
    color: var(--secondary);
    margin: 1.2rem 0 0.6rem 0;
    font-family: var(--font-main);
    font-weight: 500;
  }
  
  .competence-inner :global(p) {
    margin: 0.8rem 0;
    font-size: 1rem;
  }
  
  .competence-inner :global(.example) {
    background: rgba(46, 139, 87, 0.1);
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    border-left: 4px solid var(--primary);
    font-style: italic;
  }
  
  .competence-inner :global(.example::before) {
    content: "💡 ";
    font-style: normal;
  }
  
  /* Styles pour l'accordion "Texte de référence" */
  .reference-accordion {
    margin-top: 1.25rem;
    border-top: 1px solid #eaeaea;
    padding-top: 1rem;
  }
  .reference-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: .5rem;
    background: #f9fafb;
    border: 1px solid #eaeaea;
    border-radius: .5rem;
    padding: .75rem 1rem;
    cursor: pointer;
    color: var(--secondary);
    font-weight: 600;
    transition: background-color .2s ease;
  }
  .reference-header:hover { background: rgba(46,139,87,0.06); }
  .reference-content {
    font-size: 0.9rem;
    margin-top: .75rem;
    border: 1px solid #eaeaea;
    border-radius: .5rem;
    padding: 1rem 1.1rem;
    background: #fff;
  }
  .reference-content :global(h4) { font-size: 1rem; }
  .reference-content :global(li),
  .reference-content :global(p) { font-size: 0.9rem; }
  .reference-content :global(ul) { margin: .5rem 0 .75rem 1rem; }
  .reference-content :global(li) { margin: .25rem 0; }
  .reference-content :global(h4) { margin-top: 1rem; }
  .reference-content :global(h4:first-child) { margin-top: 0; }

  @media (max-width: 768px) {
    .competence-header {
      padding: 1rem;
    }
    
    .competence-header h3 {
      font-size: 1.2rem;
    }
    
    .competence-inner {
      padding: 1rem;
    }
    
    .competence-inner :global(h4) {
      font-size: 1.1rem;
    }
    
    .competence-inner :global(h5) {
      font-size: 1rem;
    }
  }
</style>

