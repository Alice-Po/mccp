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
        
        <div class="text-section">
          <p>
            Cette page présente les compétences exercées par la commune de Putanges-le-Lac 
            et la Communauté de Communes du Val d'Orne.
          </p>

          <h3>Sources officielles</h3>
          
          <div class="article-body">
            <ul>
              <li>
                <strong><a href="https://www.banatic.interieur.gouv.fr/intercommunalite/246100390-cc-du-val-d-orne?onglet=intercommunalite&siren=&nom=val+d%27orne&departement=&page=1#competences">Fiche BANATIC (CC du Val d'Orne)</a></strong> — Coordonnées, périmètre, délégués, finances, compétences: 
                
              </li>
              <li>
                <strong><a href="https://www.cc-valdorne.fr/cdc/images/statuts.pdf">Statuts de la CC du Val d'Orne</a></strong> — Répartition locale des compétences spécifique à la CC du Val d'Orne
              </li>
              <li>
                <strong><a href="https://www.collectivites-locales.gouv.fr/files/Comp%C3%A9tences/1.%20les%20comp%C3%A9tences/Tableau%20r%C3%A9paratition%20des%20comp%C3%A9tences_actualisation%20au%20220825.pdf">Tableau national (DGCL)</a></strong> — Répartition des compétences entre collectivités
              </li>
            </ul>
          </div>
        </div>

      <section class="competences-section">
        {#each competences as comp}
          <CompetenceSection title={comp.title} referenceData={referenceByTitle[comp.title]} isOpen={openAccordion === comp.title} on:toggle={handleAccordionToggle} />
        {/each}
      </section>
    </div>
  </div>
</div>

<style>
  .text-section {
    margin: 2rem 0;
    text-align: left;
  }
  .article-body li{
    font-size: 1rem;
  }
  .competences-layout {
    display: flex;
    min-height: 100vh;
  }

  .competences-content {
    flex: 1;
    padding: 2rem 0;
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
