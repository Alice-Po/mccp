<script>
  import { createEventDispatcher } from 'svelte';
  
  // Import dynamique des composants de compétences
  import ActionSociale from './competenceElements/ActionSociale.svelte';
  import ActionCulturelle from './competenceElements/ActionCulturelle.svelte';
  import AmenagementDvlpRural from './competenceElements/AmenagementDvlpRural.svelte';
  import DvlpEconomique from './competenceElements/DvlpEconomique.svelte';
  import EmploiInsertion from './competenceElements/EmploiInsertion.svelte';
  import EnfanceJeunesse from './competenceElements/EnfanceJeunesse.svelte';
  import Enseignement from './competenceElements/Enseignement.svelte';
  import EnvPatrimoine from './competenceElements/EnvPatrimoine.svelte';
  import LogementHabitat from './competenceElements/LogementHabitat.svelte';
  import PolitiqueVille from './competenceElements/PolitiqueVille.svelte';
  import Securite from './competenceElements/Securite.svelte';
  import Sport from './competenceElements/Sport.svelte';
  import Tourisme from './competenceElements/Tourisme.svelte';
  import Urbanisme from './competenceElements/Urbanisme.svelte';
  
  let { title, isOpen = false, referenceData: referenceDataProp = null } = $props();
  
  const dispatch = createEventDispatcher();
  
  function toggle() {
    dispatch('toggle', { title, isOpen: !isOpen });
  }
  
  let showReference = $state(false);
  let referenceData = $state(null);
  let showStatuts = $state(false);
  let statutsData = $state(null);
  
  function toggleReference() {
    showReference = !showReference;
  }
  
  function toggleStatuts() {
    showStatuts = !showStatuts;
  }
  
  // Mapping des titres vers les composants avec leur statut de contenu
  const componentMap = {
    'Action Sociale et Santé': { component: ActionSociale, hasContent: false },
    'Action Culturelle': { component: ActionCulturelle, hasContent: false },
    'Aménagement et Développement Rural': { component: AmenagementDvlpRural, hasContent: false },
    'Développement Économique': { component: DvlpEconomique, hasContent: false },
    'Emploi et Insertion': { component: EmploiInsertion, hasContent: false },
    'Enfance et Jeunesse': { component: EnfanceJeunesse, hasContent: false },
    'Enseignement': { component: Enseignement, hasContent: false },
    'Environnement et Patrimoine': { component: EnvPatrimoine, hasContent: false },
    'Logement et Habitat': { component: LogementHabitat, hasContent: false },
    'Politique de la Ville': { component: PolitiqueVille, hasContent: false },
    'Sécurité': { component: Securite, hasContent: false },
    'Sport': { component: Sport, hasContent: false },
    'Tourisme': { component: Tourisme, hasContent: false },
    'Urbanisme': { component: Urbanisme, hasContent: false },
  };
  
  // Déterminer si on a un composant avec contenu pour ce titre
  const competenceInfo = $derived(componentMap[title] || null);
  const hasCustomContent = $derived(competenceInfo?.hasContent || false);
  const CustomComponent = $derived(competenceInfo?.component || null);
  
  // Réception des données depuis le parent uniquement (pas de fetch ici)
  $effect(() => {
    referenceData = referenceDataProp ?? null;
  });
  
  // Charger et matcher les données des statuts de la CdC
  $effect(async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/assets/datas/competences/statuts-CdC.json', { cache: 'no-cache' });
      const data = await res.json();
      
      // Fonction pour trouver le contenu correspondant au titre
      const findStatutsContent = (searchTitle) => {
        const articles = data?.arrete?.articles?.[0]?.competences;
        if (!articles) return null;
        
        // Chercher dans les compétences obligatoires
        for (const item of articles.obligatoires?.items || []) {
          if (item.title === searchTitle) {
            return { type: 'Obligatoire', ...item };
          }
        }
        
        // Chercher dans les compétences optionnelles
        for (const item of articles.optionnelles?.items || []) {
          if (item.title === searchTitle) {
            return { type: 'Optionnelle', ...item };
          }
          // Chercher dans les sous-items
          if (item.subitems) {
            for (const subitem of item.subitems) {
              if (subitem.title === searchTitle) {
                return { type: 'Optionnelle', ...subitem };
              }
            }
          }
        }
        
        // Chercher dans les compétences facultatives
        for (const item of articles.facultatives?.items || []) {
          if (item.title === searchTitle) {
            return { type: 'Facultative', ...item };
          }
        }
        
        return null;
      };
      
      statutsData = findStatutsContent(title);
    } catch (e) {
      statutsData = null;
    }
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
        {#if hasCustomContent && CustomComponent}
          <!-- Afficher le composant personnalisé avec contenu vulgarisé -->
          <CustomComponent {title} />
        {:else}
          <!-- Afficher le texte par défaut -->
          <p>
            Un travail est en cours pour adapter le texte officiel décrivant les compétences
            de la commune sur cette thématique à la situation particulière de Putanges-le-Lac
            et de la Communauté de communes du Val d'Orne.
          </p>
        {/if}

        <!-- Accordion pour les statuts spécifiques de la CdC -->
        {#if statutsData}
          <div class="reference-accordion statuts-accordion">
            <button class="reference-header" type="button" onclick={toggleStatuts} aria-expanded={showStatuts}>
              <span>Texte spécifique des statuts de la CdC (
              <a 
                href="/assets/datas/competences/statuts-CdC.pdf"
                target="_blank"
                rel="noopener noreferrer"
                class="reference-link"
                onclick={(e) => e.stopPropagation()}
              >
              voir les status
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; margin-left: 0.3rem; vertical-align: middle;">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>)</span>
              <svg 
                class="toggle-icon" 
                style="transform: {showStatuts ? 'rotate(180deg)' : 'rotate(0deg)'}"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="reference-content" style="display: {showStatuts ? 'block' : 'none'};">
              <div class="statuts-type-badge">
                Compétence {statutsData.type}
              </div>
              
              {#if statutsData.content}
                {#if Array.isArray(statutsData.content)}
                  <ul>
                    {#each statutsData.content as item}
                      <li>{item}</li>
                    {/each}
                  </ul>
                {:else if typeof statutsData.content === 'string'}
                  <p>{statutsData.content}</p>
                {/if}
              {/if}
              
              {#if statutsData.subitems}
                {#each statutsData.subitems as subitem}
                  {#if typeof subitem === 'string'}
                    <p>{subitem}</p>
                  {:else if subitem.title}
                    <h5>{subitem.title}</h5>
                    {#if Array.isArray(subitem.content)}
                      <ul>
                        {#each subitem.content as item}
                          <li>{item}</li>
                        {/each}
                      </ul>
                    {:else if typeof subitem.content === 'string'}
                      <p>{subitem.content}</p>
                    {/if}
                  {/if}
                {/each}
              {/if}
            </div>
          </div>
        {/if}

        <div class="reference-accordion">
          <button class="reference-header" type="button" onclick={toggleReference} aria-expanded={showReference}>
            <span>Répartition des compétences communales et intercommunales (
            <a 
              href="https://www.collectivites-locales.gouv.fr/files/Comp%C3%A9tences/1.%20les%20comp%C3%A9tences/Tableau%20r%C3%A9paratition%20des%20comp%C3%A9tences_actualisation%20au%20220825.pdf"
              target="_blank"
              rel="noopener noreferrer"
              class="reference-link"
              onclick={(e) => e.stopPropagation()}
            >
             source juillet 2025
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; margin-left: 0.3rem; vertical-align: middle;">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>)</span>
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
  
  .reference-link {
    color: var(--primary);
    text-decoration: none;
    align-items: center;
    gap: 0.3rem;
    transition: color 0.2s ease;
    flex: 1;
  }
  
  .reference-link:hover {
    color: var(--secondary);
    text-decoration: underline;
  }
  
  .reference-link svg {
    flex-shrink: 0;
  }
  
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
  
  /* Styles pour l'accordion des statuts */
  .statuts-accordion {
    margin-bottom: 1rem;
  }
  
  .statuts-type-badge {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    color: var(--primary);
    border-radius: 0.3rem;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .statuts-accordion .reference-content h5 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--secondary);
    margin: 1rem 0 0.5rem 0;
  }

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

