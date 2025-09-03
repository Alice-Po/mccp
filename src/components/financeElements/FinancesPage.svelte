<script lang="ts">
  import { onMount } from 'svelte';
  import DrillDownModal from './DrillDownModal.svelte';
  import FinanceNavigation from './FinanceNavigation.svelte';
  import HorizontalBarChart from './HorizontalBarChart.svelte';
  import FiscaliteTable from './FiscaliteTable.svelte';
  import DonutChart from './DonutChart.svelte';
  import IndicateursFinanciers from './IndicateursFinanciers.svelte';
  import FinancialTable from './FinancialTable.svelte';
  import Download from '../commonsElements/Download.svelte';
  import { aggregateData, aggregateByChapitreForHorizontalBarChart, buildOverviewDataByChapitre } from '../../utils/budget-data';
  import type { FiscaliteItem, IndicateurFinancier, BudgetItem } from '../../types';

  // Variables réactives
  let budgetData: BudgetItem[] = $state([]);
  let fiscaliteData: FiscaliteItem[] = $state([]);
  let indicateursData: IndicateurFinancier[] = $state([]);
  
  // Données calculées (dérivées)
  let fonctionnementDepenses = $derived(aggregateData(budgetData, 'FONCTIONNEMENT', 'DEPENSES', 'regroupement_focale_n1'));
  let fonctionnementRecettes = $derived(aggregateData(budgetData, 'FONCTIONNEMENT', 'RECETTES', 'regroupement_focale_n1'));
  let investissementDepenses = $derived(aggregateData(budgetData, 'INVESTISSEMENT', 'DEPENSES', 'regroupement_focale_n1'));
  let investissementRecettes = $derived(aggregateData(budgetData, 'INVESTISSEMENT', 'RECETTES', 'regroupement_focale_n1'));
  
  let barChartFonctionnementDepensesChapitre = $derived(aggregateByChapitreForHorizontalBarChart(budgetData, 'FONCTIONNEMENT', 'DEPENSES'));
  let barChartFonctionnementRecettesChapitre = $derived(aggregateByChapitreForHorizontalBarChart(budgetData, 'FONCTIONNEMENT', 'RECETTES'));
  let barChartInvestissementDepensesChapitre = $derived(aggregateByChapitreForHorizontalBarChart(budgetData, 'INVESTISSEMENT', 'DEPENSES'));
  let barChartInvestissementRecettesChapitre = $derived(aggregateByChapitreForHorizontalBarChart(budgetData, 'INVESTISSEMENT', 'RECETTES'));
  
  let financialTableFonctionnementDepenses = $derived(
    budgetData.filter(item => item.SECTION === 'FONCTIONNEMENT' && item['DÉPENSES/RECETTES'] === 'DEPENSES')
  );
  let financialTableFonctionnementRecettes = $derived(
    budgetData.filter(item => item.SECTION === 'FONCTIONNEMENT' && item['DÉPENSES/RECETTES'] === 'RECETTES')
  );
  let financialTableInvestissementDepenses = $derived(
    budgetData.filter(item => item.SECTION === 'INVESTISSEMENT' && item['DÉPENSES/RECETTES'] === 'DEPENSES')
  );
  let financialTableInvestissementRecettes = $derived(
    budgetData.filter(item => item.SECTION === 'INVESTISSEMENT' && item['DÉPENSES/RECETTES'] === 'RECETTES')
  );
  
  let overviewFonctionnementDepenses = $derived(
    buildOverviewDataByChapitre(financialTableFonctionnementDepenses, 'Dépenses de fonctionnement détaillées')
  );

  let overviewFonctionnementRecettes = $derived(
    buildOverviewDataByChapitre(financialTableFonctionnementRecettes, 'Recettes de fonctionnement détaillées')
  );  

  let overviewInvestissementDepenses = $derived(
    buildOverviewDataByChapitre(financialTableInvestissementDepenses, 'Dépenses d\'investissement détaillées')
  );

  let overviewInvestissementRecettes = $derived(  
    buildOverviewDataByChapitre(financialTableInvestissementRecettes, 'Recettes d\'investissement détaillées')
  );
    
  let isModalOpen = $state(false);
  let modalData = $state<{
    category: string;
    section: string;
    type: string;
  } | null>(null);

  let accordions = $state<{
  'accordion-fonctionnement': boolean;
  'accordion-fonctionnement-chapitre': boolean;
  'accordion-investissement': boolean;
  'accordion-investissement-chapitre': boolean;
}>({
  'accordion-fonctionnement': false,
  'accordion-fonctionnement-chapitre': false,
  'accordion-investissement': false,
  'accordion-investissement-chapitre': false
});

function toggleAccordion(id: keyof typeof accordions) {
  const wasClosed = !accordions[id];
  accordions[id] = !accordions[id];
  
  // Si l'accordion vient de s'ouvrir, scroller vers lui
  if (wasClosed) {
    setTimeout(() => {
      const accordionElement = document.getElementById(id);
      if (accordionElement) {
        // Calculer la position avec un offset pour laisser de l'espace
        const headerHeight = 80; // Hauteur approximative du header fixe
        const offset = 20; // Espace supplémentaire
        const elementTop = accordionElement.offsetTop - headerHeight - offset;
        
        window.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      }
    }, 150); // Délai pour laisser l'animation d'ouverture se déclencher
  }
}
  
  // Configuration des libellés d'accordéon
  const ACCORDION_LABELS = {
    'accordion-fonctionnement': {
      open: 'Masquer la comparaison',
      closed: 'Voir la comparaison prévisions vs réalisations'
    },
    'accordion-fonctionnement-chapitre': {
      open: 'Masquer le tableau des chapitres détaillés',
      closed: 'Voir le tableau des chapitres détaillés'
    },
    'accordion-investissement': {
      open: 'Masquer la comparaison',
      closed: 'Voir la comparaison prévisions vs réalisations'
    },
    'accordion-investissement-chapitre': {
      open: 'Masquer le tableau des chapitres détaillés',
      closed: 'Voir le tableau des chapitres détaillés'
    },
  };

      // Reactive tab states
  let fonctionnementDonutTab = $state('depenses');
  let fonctionnementBarTab = $state('depenses');
  let fonctionnementTableTab = $state('depenses');
  let investissementDonutTab = $state('depenses');
  let investissementBarTab = $state('depenses');
  let investissementTableTab = $state('depenses');

  
  // Generate chart title
  function generateDonutTitle(section: 'Fonctionnement' | 'Investissement', tab: 'depenses' | 'recettes') {
    const typeLabel = tab === 'depenses' ? 'Dépenses' : 'Recettes';
    return `${typeLabel} - ${section} - Réalisations 2024`;
  }

  function generateFinancialTableTitle(section: 'Fonctionnement' | 'Investissement', tab: 'depenses' | 'recettes') {
    const typeLabel = tab === 'depenses' ? 'Dépenses' : 'Recettes';
    return `${typeLabel} de ${section.toLowerCase()} détaillées`;
  }
    
  function handleSegmentClick(event: CustomEvent) {
    try {
      const { category } = event.detail;
      console.log('🔍 Segment cliqué:', category);
      
      // Logique simplifiée pour déterminer section/type
      let section = '';
      let type = '';
      
      // Chercher dans quelle catégorie se trouve l'élément
      if (fonctionnementDepenses.some(item => item.label === category)) {
        section = 'FONCTIONNEMENT';
        type = 'DEPENSES';
      } else if (fonctionnementRecettes.some(item => item.label === category)) {
        section = 'FONCTIONNEMENT';
        type = 'RECETTES';
      } else if (investissementDepenses.some(item => item.label === category)) {
        section = 'INVESTISSEMENT';
        type = 'DEPENSES';
      } else if (investissementRecettes.some(item => item.label === category)) {
        section = 'INVESTISSEMENT';
        type = 'RECETTES';
      } else {
        console.warn('❌ Catégorie non trouvée:', category);
        return;
      }
      
      console.log('✅ Modal data:', { category, section, type });
      
      // Ouvrir la modal avec les données simples
      modalData = { category, section, type };
      isModalOpen = true;
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'ouverture de la modal:', error);
    }
  }

  // Fonction simple pour fermer la modal
  function closeModal() {
    console.log('🔒 Fermeture de la modal');
    isModalOpen = false;
    modalData = null;
  }
  
  // Chargement des données
  async function loadBudgetData() {
    try {
      const response = await fetch('/assets/datas/2025/base_budget_2025.json');
      budgetData = await response.json();
    } catch (error) {
      console.error('❌ Finances - Erreur chargement données budget:', error);
      budgetData = [];
    }
  }
  
  async function loadFiscaliteData() {
    try {
      const response = await fetch('/assets/datas/2025/fiscalite_2025.json');
      fiscaliteData = await response.json();
    } catch (error) {
      console.error('❌ Finances - Erreur chargement données fiscalité:', error);
      fiscaliteData = [];
    }
  }
  
  async function loadIndicateursData() {
    try {
      const response = await fetch('/assets/datas/2025/indicateurs_financiers_2025.json');
      indicateursData = await response.json();
    } catch (error) {
      console.error('❌ Finances - Erreur chargement données indicateurs:', error);
      indicateursData = [];
    }
  }
  
  // Configuration des graphiques
  function setupChartManagers() {
    // Peut être supprimé si inutilisé
  };
  
  onMount(async () => {
    // Charger toutes les données
    await Promise.all([
      loadBudgetData(),
      loadFiscaliteData(),
      loadIndicateursData()
    ]);
  
    // Attendre que les données soient chargées avant de configurer les gestionnaires
    setTimeout(() => {
      setupChartManagers();
    }, 100);
  });
</script>

<!-- Contenu principal (masqué sur petits écrans) -->
<div class="finances-section">
<div class="finances-layout">
<!-- Navigation fixe à gauche -->
<aside class="finances-sidebar">
  <FinanceNavigation />
</aside>

<!-- Contenu principal à droite -->
<div class="finances-content">
  <!-- En-tête -->
  <header class="finances-header">
    <h1>Finances municipales 2024</h1>
    
    <!-- Introduction -->
    <div class="intro-section">
      <div class="intro-content">
        <p>
          Pour comprendre au mieux les données présentées ci-dessous, nous vous recommandons vivement de lire au préalable notre article 
          <a href="/blog/comment-lire-un-budget-communal-" class="intro-link">« Comment lire un budget communal ? »</a> 
          qui vous donnera les clés de lecture essentielles.
        </p>
        <p>
          Dans un souci de rendre le budget compréhensible au plus grand nombre, nous avons pris quelques largesses 
          en termes de nomenclature budgétaire officielle. Cette adaptation permet aux citoyens de trouver l'information 
          qu'ils cherchent plus facilement, sans se perdre dans les subtilités techniques de la comptabilité publique.
        </p>
      </div>
    </div>

    <!-- Section de téléchargement -->
    <div class="cta-container">
      <Download 
        url="/assets/datas/2025/Budget-primitif-2025-Putanges.pdf"
        label="Budget complet"
        format="PDF"
      />
      <Download 
        url="/assets/datas/2025/Budget-primitif-2025.ods"
        label="Budget complet"
        format="ODS"
      />
    </div>
  </header>

          <!-- Section Fonctionnement -->
  <section class="chart-section" id="section-budget-fonctionnement">
    <div class="section-header">
      <h2>Budget de fonctionnement 2024</h2>
    </div>

    <!-- Introduction section fonctionnement -->
    <div class="section-intro">
      <p>
        Le budget de fonctionnement correspond aux dépenses courantes : salaires des agents, électricité, chauffage, entretien des bâtiments, subventions aux associations… C'est un peu comme le budget familial mensuel : les charges fixes et les dépenses du quotidien.
      </p>
      
      <div class="drill-down-legend">
        <span class="legend-icon">💡</span>
        <span class="legend-text">Cliquez sur un segment pour voir le détail</span>
      </div>
    </div>
    
    <!-- Onglets Donut Fonctionnement -->
    <div class="tabs-container" id="donut-tabs-fonctionnement">
     <!-- Fonctionnement Donut Tabs -->
  <div class="tabs-container" id="donut-tabs-fonctionnement">
    <div class="tabs">
      <button 
        class="tab" 
        class:tab-active={fonctionnementDonutTab === 'depenses'} 
        onclick={() => fonctionnementDonutTab = 'depenses'}
        data-tab="depenses"
        data-section="fonctionnement-donut"
      >
        Dépenses
      </button>
      <button 
        class="tab" 
        class:tab-active={fonctionnementDonutTab === 'recettes'} 
        onclick={() => fonctionnementDonutTab = 'recettes'}
        data-tab="recettes"
        data-section="fonctionnement-donut"
      >
        Recettes
      </button>
    </div>
  </div>
    </div>

    <div class="chart-wrapper" id="chart-fonctionnement">
      <DonutChart 
      data={fonctionnementDonutTab === 'depenses' ? fonctionnementDepenses : fonctionnementRecettes}
      title={generateDonutTitle('Fonctionnement', fonctionnementDonutTab as 'depenses' | 'recettes')}
      chartId="chart-fonctionnement"
      enableDrillDown={true}
      onsegmentclick={(e: CustomEvent<{ category: string; value: number; index: number }>) => handleSegmentClick(e)}
    />
    </div>

          <!-- Commentaire sur les réalisations -->
          <div class="realization-comment">
            <div class="comment-content">
              <h3><svg class="analysis-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg> Analyse de la différence entre prévision, réalisation et proposition </h3>
              <p>
                Explication des écarts entre prévision, réalisation et proposition. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dui massa, semper in placerat eget, iaculis eu justo. Morbi et risus eget erat cursus lobortis. Sed porttitor nisi mattis mauris consequat imperdiet. Donec eget bibendum eros. Donec elit neque, porttitor sed dictum eget, blandit eu neque. Suspendisse at orci vitae nisi blandit rhoncus vitae ut mi. Nullam ultrices volutpat lectus.
              </p>
              <div class="cta-container">
                <button class="cta" onclick={() => toggleAccordion('accordion-fonctionnement')} aria-expanded={accordions['accordion-fonctionnement']}>
                  <span class="cta-text">
                    {accordions['accordion-fonctionnement']
                      ? ACCORDION_LABELS['accordion-fonctionnement'].open
                      : ACCORDION_LABELS['accordion-fonctionnement'].closed}
                  </span>                  <svg class="cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <button class="cta" onclick={() => toggleAccordion('accordion-fonctionnement-chapitre')} aria-expanded={accordions['accordion-fonctionnement-chapitre']}>
                  <span class="cta-text">
                    {accordions['accordion-fonctionnement-chapitre']
                      ? ACCORDION_LABELS['accordion-fonctionnement-chapitre'].open
                      : ACCORDION_LABELS['accordion-fonctionnement-chapitre'].closed}
                  </span>
                  <svg class="cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Accordéon pour le graphique de comparaison -->
          <div class="accordion-wrapper" id="accordion-fonctionnement">
            {#if accordions['accordion-fonctionnement']}

            <div class="accordion-content">
              <div class="accordion-header">
                <h4>Comparaison détaillée par chapitre</h4>
                <p> Explication de pourquoi on a choisi la répartition par graphique ici. Donec eget bibendum eros. Donec elit neque, porttitor sed dictum eget, blandit eu neque. Suspendisse at orci vitae nisi blandit rhoncus vitae ut mi. Nullam ultrices volutpat lectus. </p>
              </div>
              
              <!-- Onglets pour le graphique de comparaison -->
              <div class="tabs-container" id="bar-tabs-fonctionnement">
                <div class="tabs">
                  <button 
                    class="tab" 
                    class:tab-active={fonctionnementBarTab === 'depenses'} 
                    onclick={() => fonctionnementBarTab = 'depenses'}
                    data-tab="depenses"
                    data-section="fonctionnement-bar"
                  >
                    Dépenses
                  </button>
                  <button 
                    class="tab" 
                    class:tab-active={fonctionnementBarTab === 'recettes'} 
                    onclick={() => fonctionnementBarTab = 'recettes'}
                    data-tab="recettes"
                    data-section="fonctionnement-bar"
                  >
                    Recettes
                  </button>
                </div>
              </div>

              <!-- Graphique de comparaison -->
              <div class="chart-wrapper" id="bar-fonctionnement">
                <HorizontalBarChart 
                  data={fonctionnementBarTab === 'depenses' ? barChartFonctionnementDepensesChapitre : barChartFonctionnementRecettesChapitre}
                  chartId="bar-fonctionnement"
                />
              </div>
            </div>
            {/if}
          </div>
         

        <!-- Accordéon pour le tableau des dépenses et recettes par chapitre -->
        <div class="accordion-wrapper" id="accordion-fonctionnement-chapitre">
          {#if accordions['accordion-fonctionnement-chapitre']}
          <div class="accordion-content">
            <div class="accordion-header">
              <h4>Tableau des dépenses et recettes par chapitre</h4>
              <p> Explication de pourquoi on a choisi la répartition par graphique ici. Donec eget bibendum eros. Donec elit neque, porttitor sed dictum eget, blandit eu neque. Suspendisse at orci vitae nisi blandit rhoncus vitae ut mi. Nullam ultrices volutpat lectus. </p>
            </div>
            
            <!-- Onglets pour le graphique de comparaison -->
            <div class="tabs-container" id="bar-tabs-fonctionnement-chapitre">
              <div class="tabs">
                <button 
                  class="tab" 
                  class:tab-active={fonctionnementTableTab === 'depenses'} 
                  onclick={() => fonctionnementTableTab = 'depenses'}
                  data-tab="depenses"
                  data-section="fonctionnement-table"
                >
                  Dépenses
                </button>
                <button 
                  class="tab" 
                  class:tab-active={fonctionnementTableTab === 'recettes'} 
                  onclick={() => fonctionnementTableTab = 'recettes'}
                  data-tab="recettes"
                  data-section="fonctionnement-table"
                >
                  Recettes
                </button>
              </div>
            </div>

            <!-- Graphique de comparaison -->
            <div class="chart-wrapper" id="table-fonctionnement">
              <FinancialTable 
                data={fonctionnementTableTab === 'depenses' ? overviewFonctionnementDepenses : overviewFonctionnementRecettes}
                rawData={fonctionnementTableTab === 'depenses' ? financialTableFonctionnementDepenses : financialTableFonctionnementRecettes}
              />
            </div>
          </div>
          {/if}
        </div>
      </section>
        
        <!-- Section Investissement -->
        <section class="chart-section" id="section-budget-investissement">
          <div class="section-header">
            <h2>Budget d'investissement 2024</h2>
          </div>

          <!-- Introduction section investissement -->
          <div class="section-intro">
            <p>
              Le budget d'investissement concerne les gros projets : construction d'un nouveau bâtiment public, réfection d'une route, achat d'un véhicule… Ces dépenses ont vocation à durer dans le temps et à améliorer le patrimoine communal.
            </p>
            <div class="drill-down-legend">
              <span class="legend-icon">💡</span>
              <span class="legend-text">Cliquez sur un segment pour voir le détail</span>
            </div>
          </div>
          
          <!-- Onglets Investissement -->
          <div class="tabs-container" id="donut-tabs-investissement">
            <div class="tabs">
              <button 
                class="tab" 
                class:tab-active={investissementDonutTab === 'depenses'} 
                onclick={() => investissementDonutTab = 'depenses'}
                data-tab="depenses"
                data-section="investissement"
              >
                Dépenses
              </button>
              <button 
                class="tab" 
                class:tab-active={investissementDonutTab === 'recettes'} 
                onclick={() => investissementDonutTab = 'recettes'}
                data-tab="recettes"
                data-section="investissement"
              >
                Recettes
              </button>
            </div>
          </div>

          <!-- Graphique Investissement -->
          <div class="chart-wrapper" id="chart-investissement">
            <DonutChart 
              data={investissementDonutTab === 'depenses' ? investissementDepenses : investissementRecettes}
              title={investissementDonutTab === 'depenses' ? 'Dépenses - Investissement - Réalisations 2024' : 'Recettes - Investissement - Réalisations 2024'}
              chartId="chart-investissement"
              enableDrillDown={true}
              onsegmentclick={(e: CustomEvent<{ category: string; value: number; index: number }>) => handleSegmentClick(e)}
            />
          </div>

          <!-- Commentaire sur les réalisations -->
          <div class="realization-comment">
            <div class="comment-content">
              <h3><svg class="analysis-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg> Analyse des investissements réalisés</h3>
              <p>
                Explication des écarts entre prévision, réalisation et proposition. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dui massa, semper in placerat eget, iaculis eu justo. Morbi et risus eget erat cursus lobortis. Sed porttitor nisi mattis mauris consequat imperdiet. Donec eget bibendum eros. Donec elit neque, porttitor sed dictum eget, blandit eu neque. Suspendisse at orci vitae nisi blandit rhoncus vitae ut mi. Nullam ultrices volutpat lectus.
              </p>
              <div class="cta-container">
                <button class="cta" onclick={() => toggleAccordion('accordion-investissement')} aria-expanded={accordions['accordion-investissement']}>
                  <span class="cta-text">Voir la comparaison prévisions vs réalisations</span>
                  <svg class="cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                  <button class="cta" onclick={() => toggleAccordion('accordion-investissement-chapitre')} aria-expanded={accordions['accordion-investissement-chapitre']}>
                  <span class="cta-text">
                    {accordions['accordion-investissement-chapitre']
                      ? ACCORDION_LABELS['accordion-investissement-chapitre'].open
                      : ACCORDION_LABELS['accordion-investissement-chapitre'].closed}
                  </span>
                  <svg class="cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

              </div>
            </div>
          </div>

          <!-- Accordéon pour le graphique de comparaison -->
          <div class="accordion-wrapper" id="accordion-investissement">
            {#if accordions['accordion-investissement']}
            <div class="accordion-content">
              <div class="accordion-header">
                <h4>Comparaison détaillée par chapitre</h4>
                <p> Explication de pourquoi on a choisi la répartition par graphique ici. Donec eget bibendum eros. Donec elit neque, porttitor sed dictum eget, blandit eu neque. Suspendisse at orci vitae nisi blandit rhoncus vitae ut mi. Nullam ultrices volutpat lectus. </p>
              </div>
              
              <!-- Onglets pour le graphique de comparaison -->
              <div class="tabs-container" id="bar-tabs-investissement">
                <div class="tabs">
                  <button 
                    class="tab" 
                    class:tab-active={investissementBarTab === 'depenses'} 
                    onclick={() => investissementBarTab = 'depenses'}
                    data-tab="depenses"
                    data-section="investissement-bar"
                  >
                    Dépenses
                  </button>
                  <button 
                    class="tab" 
                    class:tab-active={investissementBarTab === 'recettes'} 
                    onclick={() => investissementBarTab = 'recettes'}
                    data-tab="recettes"
                    data-section="investissement-bar"
                  >
                    Recettes
                  </button>
                </div>
              </div>

              <!-- Graphique de comparaison -->
              <div class="chart-wrapper" id="bar-investissement">
                <HorizontalBarChart 
                  data={investissementBarTab === 'depenses' ? barChartInvestissementDepensesChapitre : barChartInvestissementRecettesChapitre}
                  chartId="bar-investissement"
                />
              </div>
            </div>
            {/if}
          </div>
         <!-- Accordéon pour le tableau des dépenses et recettes par chapitre -->
        <div class="accordion-wrapper" id="accordion-investissement-chapitre">
          {#if accordions['accordion-investissement-chapitre']}
          <div class="accordion-content">
            <div class="accordion-header">
              <h4>Tableau des dépenses et recettes d'investissement par chapitre</h4>
              <p> Explication de pourquoi on a choisi la répartition par graphique ici. Donec eget bibendum eros. Donec elit neque, porttitor sed dictum eget, blandit eu neque. Suspendisse at orci vitae nisi blandit rhoncus vitae ut mi. Nullam ultrices volutpat lectus. </p>
            </div>
            
            <!-- Onglets pour le graphique de comparaison -->
            <div class="tabs-container" id="bar-tabs-investissement-chapitre">
              <div class="tabs">
                <button 
                  class="tab" 
                  class:tab-active={investissementTableTab === 'depenses'} 
                  onclick={() => investissementTableTab = 'depenses'}
                  data-tab="depenses"
                  data-section="investissement-table"
                >
                  Dépenses
                </button>
                <button 
                  class="tab" 
                  class:tab-active={investissementTableTab === 'recettes'} 
                  onclick={() => investissementTableTab = 'recettes'}
                  data-tab="recettes"
                  data-section="investissement-table"
                >
                  Recettes
                </button>
              </div>
            </div>

            <!-- Graphique de comparaison -->
            <div class="chart-wrapper" id="table-investissement-chapitre">
              <FinancialTable 
                data={investissementTableTab === 'depenses' ? overviewInvestissementDepenses : overviewInvestissementRecettes}
                rawData={investissementTableTab === 'depenses' ? financialTableInvestissementDepenses : financialTableInvestissementRecettes}
              />
            </div>
          </div>
          {/if}
        </div>
        </section>
        <!-- Section Fiscalité -->
        <section class="chart-section" id="section-fiscalite">
          <div class="section-header">
            <h2>Fiscalité locale 2025</h2>
          </div>
          
          <!-- Tableau de fiscalité -->
          <div class="chart-wrapper" id="fiscalite-wrapper">
            <FiscaliteTable 
              data={fiscaliteData}
            />
          </div>
        </section>

        <!-- Section Indicateurs Financiers -->
        <section class="chart-section" id="section-indicateurs-financiers">
          <div class="section-header">
            <h2>Indicateurs financiers 2025</h2>
          </div>
          
          <!-- Indicateurs financiers -->
          <div class="chart-wrapper" id="indicateurs-wrapper">
            <IndicateursFinanciers 
              data={indicateursData}
            />
          </div>
        </section>
        <!-- Section Conclusion -->
  <div id="section-conclusion" class="conclusion-section">
    <div class="conclusion-header">
      <h2>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        Conclusion
      </h2>
    </div>
    <div class="conclusion-content">
      <p>
        La commune de Putanges-le-Lac présente une situation financière très saine. Elle est très peu endettée et dégage, chaque année, des marges de manœuvre budgétaires qui peuvent être mobilisées pour financer des projets d'équipement. Revers de cette situation financière, on peut relever le faible niveau d'intervention de la commune. C'est notamment le cas en matière de soutien au tissu associatif. C'est également le cas des projets d'équipement dont les réalisations sont très en-deça des inscriptions prévues dans le cadre du budget.
      </p>
      <p>
        Le niveau de la pression fiscale peut également interroger : le taux de la taxe foncière est le 28ème le plus élevé sur l'échantillon des 113 communes de l'Orne de la même strate démographique (source OFGL). Putanges-le-Lac apparaît donc comme une commune qui mobilise beaucoup de moyens, tant auprès de l'État que des contribuables, pour une mise en oeuvre de services et de projets sur le territoire très prudente, voire insuffisante.
      </p>
      <p>
        Il faut également noter la situation relative par rapport à la communauté de communes : alors que la communauté porte l'essentiel des services à la population, elle se trouve dans une situation financière tendue, aux antipodes de la commune principale. Ceci peut questionner la pertinence de l'équilibre fiscal trouvé entre communes et communauté.
      </p>
    </div>
  </div>
</div>


      </div>
    </div>

    <!-- Modal de drill-down -->
    <DrillDownModal
      isOpen={isModalOpen}
      budgetData={budgetData}
      modalData={modalData}
      onclose={closeModal}
    />

    
    <style>

      .finances-content section{
        margin: 0 auto;
      }
    
      .finances-layout {
        display: flex;
        gap: 2rem;
        min-height: 100vh;
        max-width: 1600px;
        margin: 0 auto;
        padding: 2rem;
      }
    
      .finances-sidebar {
        flex-shrink: 0;
      }
    
      .finances-content {
        flex: 1;
        min-width: 0;
      }
    
      .finances-header {
        text-align: left;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(46, 139, 87, 0.1);
      }
    
      .finances-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--secondary);
        margin-bottom: 2rem;
        text-align: center;
      }
    
      /* Introduction */
      .intro-section {
        background: #f8fafc;
        border-radius: 1rem;
        padding: 2rem;
        margin-bottom: 0.5rem;
        border-left: 4px solid var(--primary);
      }
    
      .intro-content p {
        font-size: 1.1rem;
        color: #374151;
        line-height: 1.7;
        margin-bottom: 1rem;
      }
    
      .intro-content p:last-child {
        margin-bottom: 0;
      }
    
      .intro-link {
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }
    
      .intro-link:hover {
        color: var(--primary-dark);
        border-bottom-color: var(--primary);
      }

      .chart-section {
        border-radius: 1rem;
        padding: 2rem;
        margin-bottom: 2rem;
        scroll-margin-top: 2rem;
      }
    
      .section-header {
        text-align: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(46, 139, 87, 0.1);
      }
    
      .section-header h2 {
        font-size: 1.8rem;
        font-weight: 600;
        color: var(--primary);
        margin-bottom: 0.5rem;
      }
  
      .tabs-container {
        margin: 2rem 0;
      }
    
      .tabs {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
    
      .tab {
        background: none;
        border: none;
        padding: 0.5rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        color: #333;
        border-bottom: 2.5px solid transparent;
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s, background-color 0.2s;
        border-radius: 0.25rem 0.25rem 0 0;
      }
    
      .tab:hover {
        color: var(--primary);
      }
    
      .tab:focus {
        outline: 2px solid var(--primary);
      }
    

    
      .chart-wrapper {
        min-height: 400px;
      }
    
      /* Styles pour les commentaires et accordéons */
      .realization-comment {
        margin-top: 2rem;
        background: #f8fafc;
        border-radius: 1rem;
        padding: 2rem;
        border-left: 4px solid var(--secondary);
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);
      }
    
      .comment-content h3 {
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--secondary);
        margin: 0 0 1rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    
      .comment-content p {
        font-size: 1rem;
        color: var(--secondary);
        line-height: 1.7;
        margin: 0 0 1.5rem 0;
        font-weight: 500;
      }
    
      .cta-container {
        display: flex;
        justify-content: center;
      }
    
      .cta{
        background: white;
        color: var(--primary);
        border: 1px solid var(--primary);
        box-shadow: 0 4px 12px rgba(46, 139, 87, 0.3);
       
        padding: 0.75rem 1.5rem;
        border-radius: 0.75rem;
        margin: 0 1rem;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
      }
  
    
      .cta-icon {
        transition: transform 0.3s ease;
      }
    
    
      .cta[aria-expanded="true"] {
        background: var(--primary);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(46, 139, 87, 0.3);
      }
    
      .accordion-content {
        padding: 2rem;
        border-top: 1px solid rgba(46, 139, 87, 0.1);
      }
    
      .accordion-header {
        text-align: center;
        margin-bottom: 2rem;
      }
    
      .accordion-header h4 {
        color: var(--primary);
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
    
      .accordion-header p {
        color: #6b7280;
        font-size: 1rem;
        margin: 0;
      }
  

    
  /* Responsive pour masquer la sidebar en dessous de 1299px */
  @media (max-width: 1299px) {
    .finances-sidebar {
      display: none;
    }
    
    .finances-layout {
      gap: 1rem;
      padding: 1rem;
    }
    
    .finances-content {
      width: 100%;
    }
  }

  /* Responsive pour les grands écrans */
  @media (min-width: 1400px) and (max-width: 1599px) {
    .finances-layout {
      gap: 1.5rem;
      padding: 1.5rem;
    }
  }

  /* Responsive pour les petits écrans */
  @media (max-width: 768px) {
    .finances-header h1 {
      font-size: 2rem;
    }

    .intro-section {
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .intro-content p {
      font-size: 1rem;
    }

    .chart-section {
      padding: 1.5rem;
    }

    .cta-container {
      flex-direction: column;
      align-items: center;
    }

    .cta {
      margin: 0.5rem 0;
      padding: 0.75rem 1rem;
    }
  }

@keyframes gentle-pulse {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.12); }
  }
    
    </style>