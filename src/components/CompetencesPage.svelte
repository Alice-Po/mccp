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
</script>

<div class="competences-layout">
  <CompetenceNavigation />
  
  <div class="competences-content">
    <div class="content-wrapper">
      <h1>Compétences municipales et intercommunales</h1>
      
      <section class="text-section">
        <p>
          Les compétences exercées par la commune de Putanges-le-Lac et la Communauté de Communes du Val d'Orne. 
        </p>
        <small>source : <a href="https://www.collectivites-locales.gouv.fr/files/Comp%C3%A9tences/1.%20les%20comp%C3%A9tences/Tableau%20r%C3%A9paratition%20des%20comp%C3%A9tences_actualisation%20au%20220825.pdf">https://www.collectivites-locales.gouv.fr</a></small>
      </section>

      <section class="competences-section">
        <CompetenceSection title="Sécurité">
          <Securite />
        </CompetenceSection>

        <CompetenceSection title="Action Sociale et Santé">
          <ActionSociale />
        </CompetenceSection>
        
        <CompetenceSection title="Emploi et Insertion">
          <EmploiInsertion />
        </CompetenceSection>
        
        <CompetenceSection title="Enfance et Jeunesse">
          <EnfanceJeunesse />
        </CompetenceSection>

        <CompetenceSection title="Urbanisme et Aménagement">
          <Urbanisme />
        </CompetenceSection>

        <CompetenceSection title="Enseignement">
          <Enseignement />
        </CompetenceSection>

        <CompetenceSection title="Tourisme">
          <Tourisme />
        </CompetenceSection>

        <CompetenceSection title="Action Culturelle">
          <ActionCulturelle />
        </CompetenceSection>

        <CompetenceSection title="Politique de la Ville">
          <PolitiqueVille />
        </CompetenceSection>

        <CompetenceSection title="Sport">
          <Sport />
        </CompetenceSection>

        <CompetenceSection title="Aménagement du Territoire">
          <AmenagementDvlpRural />
        </CompetenceSection>

        <CompetenceSection title="Environnement et Patrimoine">
          <EnvPatrimoine />
        </CompetenceSection>

        <CompetenceSection title="Logement et Habitat">
          <LogementHabitat />
        </CompetenceSection>

        <CompetenceSection title="Développement économique">
          <DvlpEconomique />
        </CompetenceSection>
      </section>
    </div>
  </div>
</div>
