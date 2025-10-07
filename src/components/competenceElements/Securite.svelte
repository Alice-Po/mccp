<script>
  import '../../styles/competences.css';
  
  const { title = 'Sécurité' } = $props();
  
  let showReference = $state(false);
  let referenceData = $state(null);
  
  function toggleReference() {
    showReference = !showReference;
  }
  
  $effect(async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/assets/datas/competences/competences.json', { cache: 'no-cache' });
      const data = await res.json();
      const item = (data?.competences || []).find((c) => c?.title === title);
      referenceData = item?.["COMMUNES OU EPCI"] ?? null;
    } catch (e) {
      referenceData = null;
    }
  });
</script>

<div class="competence-section">
  <p>
    Un travail est en cours pour adapter le texte officiel décrivant les compétences
    de la commune sur cette thématique à la situation particulière de Putanges-le-Lac
    et de la Communauté de communes du Val d'Orne. Ce contenu est en cours.
  </p>

  <!-- Accordion pour le texte de référence (depuis competences.json) -->
  <div class="reference-accordion">
    <button class="reference-header" type="button" on:click={toggleReference}>
      <span>Texte de référence</span>
      <svg class="toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
