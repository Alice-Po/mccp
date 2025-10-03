<script>
  import CompetenceNavigation from './CompetenceNavigation.svelte';
  import CompetenceSection from './CompetenceSection.svelte';
  
  // Import des composants de compétences migrés vers Svelte
  import EnfanceJeunesse from './competenceElements/EnfanceJeunesse.svelte';
  import Urbanisme from './competenceElements/Urbanisme.svelte';
  import Enseignement from './competenceElements/Enseignement.svelte';
  import Tourisme from './competenceElements/Tourisme.svelte';
  import ActionCulturelle from './competenceElements/ActionCulturelle.svelte';
  import PolitiqueVille from './competenceElements/PolitiqueVille.svelte';
  import Sport from './competenceElements/Sport.svelte';
  import ActionSociale from './competenceElements/ActionSociale.svelte';
  import EmploiInsertion from './competenceElements/EmploiInsertion.svelte';
  import AmenagementDvlpRural from './competenceElements/AmenagementDvlpRural.svelte';
  import EnvPatrimoine from './competenceElements/EnvPatrimoine.svelte';
  import LogementHabitat from './competenceElements/LogementHabitat.svelte';
  import Securite from './competenceElements/Securite.svelte';
  import DvlpEconomique from './competenceElements/DvlpEconomique.svelte';

  // État global pour gérer l'accordéon exclusif
  let openAccordion = $state(null);

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
        <CompetenceSection title="Sécurité" isOpen={openAccordion === "Sécurité"} on:toggle={handleAccordionToggle}>
          <Securite />
        </CompetenceSection>

        <CompetenceSection title="Action Sociale et Santé" isOpen={openAccordion === "Action Sociale et Santé"} on:toggle={handleAccordionToggle}>
          <ActionSociale />
        </CompetenceSection>
        
        <CompetenceSection title="Emploi et Insertion" isOpen={openAccordion === "Emploi et Insertion"} on:toggle={handleAccordionToggle}>
          <EmploiInsertion />
        </CompetenceSection>
        
        <CompetenceSection title="Enseignement" isOpen={openAccordion === "Enseignement"} on:toggle={handleAccordionToggle}>
            <Enseignement />
          </CompetenceSection>
          
        <CompetenceSection title="Enfance et Jeunesse" isOpen={openAccordion === "Enfance et Jeunesse"} on:toggle={handleAccordionToggle}>
          <EnfanceJeunesse />
        </CompetenceSection>

        <CompetenceSection title="Urbanisme et Aménagement" isOpen={openAccordion === "Urbanisme et Aménagement"} on:toggle={handleAccordionToggle}>
          <Urbanisme />
        </CompetenceSection>

    

        <CompetenceSection title="Tourisme" isOpen={openAccordion === "Tourisme"} on:toggle={handleAccordionToggle}>
          <Tourisme />
        </CompetenceSection>

        <CompetenceSection title="Action Culturelle" isOpen={openAccordion === "Action Culturelle"} on:toggle={handleAccordionToggle}>
          <ActionCulturelle />
        </CompetenceSection>

        <CompetenceSection title="Politique de la Ville" isOpen={openAccordion === "Politique de la Ville"} on:toggle={handleAccordionToggle}>
          <PolitiqueVille />
        </CompetenceSection>

        <CompetenceSection title="Sport" isOpen={openAccordion === "Sport"} on:toggle={handleAccordionToggle}>
          <Sport />
        </CompetenceSection>

        <CompetenceSection title="Aménagement du Territoire" isOpen={openAccordion === "Aménagement du Territoire"} on:toggle={handleAccordionToggle}>
          <AmenagementDvlpRural />
        </CompetenceSection>

        <CompetenceSection title="Environnement et Patrimoine" isOpen={openAccordion === "Environnement et Patrimoine"} on:toggle={handleAccordionToggle}>
          <EnvPatrimoine />
        </CompetenceSection>

        <CompetenceSection title="Logement et Habitat" isOpen={openAccordion === "Logement et Habitat"} on:toggle={handleAccordionToggle}>
          <LogementHabitat />
        </CompetenceSection>

        <CompetenceSection title="Développement économique" isOpen={openAccordion === "Développement économique"} on:toggle={handleAccordionToggle}>
          <DvlpEconomique />
        </CompetenceSection>
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
    max-width: 800px;
    margin: 0 auto;
  }

  .text-section {
    margin-bottom: 3rem;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 1rem;
    border-left: 4px solid #2e8b57;
  }

  .text-section p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #495057;
    margin-bottom: 1rem;
  }

  .text-section small {
    font-size: 0.9rem;
    color: #6c757d;
  }

  .text-section a {
    color: #2e8b57;
    text-decoration: none;
  }

  .text-section a:hover {
    text-decoration: underline;
  }

  .competences-section {
    margin-top: 2rem;
  }
</style>
