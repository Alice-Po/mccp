<script>
  import CompetenceNavigation from './CompetenceNavigation.svelte';
  import CompetenceSection from './CompetenceSection.svelte';

  // État global pour gérer l'accordéon exclusif
  let openAccordion = $state(null);
  let competences = $state([]);
  let referenceByTitle = $state({});

  function handleAccordionToggle(event) {
    const { title, isOpen } = event.detail;
    
    if (isOpen) {
      // Si on ouvre un accordéon, fermer tous les autres
      openAccordion = title;
    } else {
      // Si on ferme l'accordéon ouvert, réinitialiser
      openAccordion = null;
    }
  }

  // Charger la liste des compétences depuis le JSON pour piloter l'ordre et les titres
  $effect(async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/assets/datas/competences/competences.json', { cache: 'no-cache' });
      const data = await res.json();
      const list = Array.isArray(data?.competences) ? data.competences : [];
      competences = list;
      const map = {};
      for (const c of list) {
        map[c.title] = c?.["COMMUNES OU EPCI"] ?? null;
      }
      referenceByTitle = map;
    } catch (e) {
      competences = [];
    }
  });
</script>

<div class="competences-layout">
  <CompetenceNavigation />
  
  <div class="competences-content">
    <div class="content-wrapper">
      <h1>Compétences municipales et intercommunales</h1>
      
        <p>
          Les compétences exercées par la commune de Putanges-le-Lac et la Communauté de Communes du Val d'Orne. 
        </p>
        <small>source : <a href="https://www.collectivites-locales.gouv.fr/files/Comp%C3%A9tences/1.%20les%20comp%C3%A9tences/Tableau%20r%C3%A9paratition%20des%20comp%C3%A9tences_actualisation%20au%20220825.pdf">https://www.collectivites-locales.gouv.fr</a></small>

      <section class="competences-section">
        {#each competences as comp}
          <CompetenceSection title={comp.title} referenceData={referenceByTitle[comp.title]} isOpen={openAccordion === comp.title} on:toggle={handleAccordionToggle} />
        {/each}
      </section>
    </div>
  </div>
</div>

<style>
  .competences-layout {
    display: flex;
    min-height: 100vh;
  }

  .competences-content {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .content-wrapper {
    margin: 0 ;
  }
  .competences-section {
    margin-top: 2rem;
  }
</style>
