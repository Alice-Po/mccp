<script lang="ts">
    import { onMount } from 'svelte';
    import DrillDownModal from './DrillDownModal.svelte';
    import FinanceNavigation from './FinanceNavigation.svelte';
    import HorizontalBarChart from './HorizontalBarChart.svelte';
    import FiscaliteTable from './FiscaliteTable.svelte';
    import DonutChart from './DonutChart.svelte';
    import IndicateursFinanciers from './IndicateursFinanciers.svelte';
    import FinancialTable from './FinancialTable.svelte';
    import { aggregateData, aggregateByChapitre, buildOverviewDataByChapitre } from '../../utils/budget-data';
    import type { BudgetItem, FiscaliteItem, IndicateurFinancier } from '../../types/finances';
    
    // Variables réactives
    let budgetData: BudgetItem[] = $state([]);
    let fiscaliteData: FiscaliteItem[] = $state([]);
    let indicateursData: IndicateurFinancier[] = $state([]);
    
    // Données calculées (dérivées)
    let fonctionnementDepenses = $derived(aggregateData(budgetData, 'FONCTIONNEMENT', 'DEPENSES', 'regroupement_focale_n1'));
    let fonctionnementRecettes = $derived(aggregateData(budgetData, 'FONCTIONNEMENT', 'RECETTES', 'regroupement_focale_n1'));
    let investissementDepenses = $derived(aggregateData(budgetData, 'INVESTISSEMENT', 'DEPENSES', 'regroupement_focale_n1'));
    let investissementRecettes = $derived(aggregateData(budgetData, 'INVESTISSEMENT', 'RECETTES', 'regroupement_focale_n1'));
    
    let barChartFonctionnementDepensesChapitre = $derived(aggregateByChapitre(budgetData, 'FONCTIONNEMENT', 'DEPENSES'));
    let barChartFonctionnementRecettesChapitre = $derived(aggregateByChapitre(budgetData, 'FONCTIONNEMENT', 'RECETTES'));
    let barChartInvestissementDepensesChapitre = $derived(aggregateByChapitre(budgetData, 'INVESTISSEMENT', 'DEPENSES'));
    let barChartInvestissementRecettesChapitre = $derived(aggregateByChapitre(budgetData, 'INVESTISSEMENT', 'RECETTES'));
    
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
    
    // État de la modal
    let currentModalState = $state({
      isOpen: false,
      selectedCategory: '',
      section: '',
      type: '',
      valueField: 'REALISATIONS_2024'
    });
    let accordions = $state({
    'accordion-fonctionnement': false,
    'accordion-fonctionnement-chapitre': false,
    'accordion-investissement': false,
    'accordion-investissement-chapitre': false
  });

  function toggleAccordion(id: string) {
    accordions[id] = !accordions[id];
  }
    
    // Configuration des libellés d'accordéon
    const ACCORDION_LABELS = {
      'accordion-fonctionnement': {
        open: 'Masquer la comparaison',
        closed: 'Voir la comparaison prévisions vs réalisations'
      },
      'accordion-fonctionnement-chapitre': {
        open: 'Masquer le tableau des dépenses par chapitre',
        closed: 'Voir le tableau des dépenses par chapitre'
      },
      'accordion-investissement': {
        open: 'Masquer la comparaison',
        closed: 'Voir la comparaison prévisions vs réalisations'
      },
      'accordion-investissement-chapitre': {
        open: 'Masquer le tableau des dépenses par chapitre',
        closed: 'Voir le tableau des dépenses par chapitre'
      },
    };
    
    
    
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
      const chartConfigs = {
        'donut-tabs-fonctionnement': {
          chartId: 'chart-fonctionnement',
          section: 'Fonctionnement',
          dataMap: {
            depenses: fonctionnementDepenses,
            recettes: fonctionnementRecettes
          }
        },
        'donut-tabs-investissement': {
          chartId: 'chart-investissement', 
          section: 'Investissement',
          dataMap: {
            depenses: investissementDepenses,
            recettes: investissementRecettes
          }
        },
        'bar-tabs-fonctionnement': {
          chartId: 'bar-fonctionnement',
          section: 'Fonctionnement',
          dataMap: {
            depenses: { data: barChartFonctionnementDepensesChapitre, type: 'expenses' },
            recettes: { data: barChartFonctionnementRecettesChapitre, type: 'revenues' }
          }
        },
        'table-tabs-fonctionnement': {
          chartId: 'table-fonctionnement',
          section: 'Fonctionnement',
          dataMap: {
            depenses: { data: financialTableFonctionnementDepenses, type: 'expenses' },
            recettes: { data: financialTableFonctionnementRecettes, type: 'revenues' }
          }
        },
        'bar-tabs-investissement': {
          chartId: 'bar-investissement',
          section: 'Investissement', 
          dataMap: {
            depenses: { data: barChartInvestissementDepensesChapitre, type: 'expenses' },
            recettes: { data: barChartInvestissementRecettesChapitre, type: 'revenues' }
          }
        }
      };
    
      function dispatchChartUpdate(config: any) {
        const updateEvent = new CustomEvent('updateChart', { detail: config });
        document.dispatchEvent(updateEvent);
      }
    
      function generateTitle(tabType: string, section: string, isBarChart = false) {
        const typeLabel = tabType === 'depenses' ? 'Dépenses' : 'Recettes';
        const prefix = isBarChart ? 'Comparaison des' : '';
        const suffix = isBarChart ? 'par chapitre (Prévus, Réalisés, Propositions)' : '- Réalisations 2024';
        return `${prefix} ${typeLabel} - ${section} ${suffix}`.trim();
      }
    
      function createTabManager(selectorId: string, config: any) {
        const tabs = document.querySelectorAll(`#${selectorId} .tab`);
        const isBarChart = selectorId.includes('bar-tabs');
        
        function updateChart(tabType: string) {
          const dataConfig = config.dataMap[tabType];
          const title = generateTitle(tabType, config.section, isBarChart);
          
          if (isBarChart) {
            dispatchChartUpdate({
              data: dataConfig.data,
              title: title,
              chartId: config.chartId,
              type: dataConfig.type
            });
          } else {
            dispatchChartUpdate({
              data: dataConfig,
              title: title,
              chartId: config.chartId
            });
          }
        }
        
        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('tab-active'));
            tab.classList.add('tab-active');
            updateChart((tab as HTMLElement).dataset.tab || 'depenses');
          });
        });
        
        updateChart('depenses');
      }
    
      Object.entries(chartConfigs).forEach(([selectorId, config]) => {
        createTabManager(selectorId, config);
      });
    }
    
    // Gestion des événements de drill-down
    function setupDrillDownEvents() {
      document.addEventListener('segmentClick', (event: CustomEvent) => {
        const { category } = event.detail;
        
        let section = '';
        let type = '';
        
        const isFonctionnementCategory = fonctionnementDepenses.some(item => item.label === category) || 
                                       fonctionnementRecettes.some(item => item.label === category);
        const isInvestissementCategory = investissementDepenses.some(item => item.label === category) || 
                                       investissementRecettes.some(item => item.label === category);
        
        if (isFonctionnementCategory) {
          section = 'FONCTIONNEMENT';
          const activeFonctionnementTab = document.querySelector('#donut-tabs-fonctionnement .tab-active') as HTMLElement;
          type = activeFonctionnementTab?.dataset.tab === 'recettes' ? 'RECETTES' : 'DEPENSES';
        } else if (isInvestissementCategory) {
          section = 'INVESTISSEMENT';
          const activeInvestissementTab = document.querySelector('#donut-tabs-investissement .tab-active') as HTMLElement;
          type = activeInvestissementTab?.dataset.tab === 'recettes' ? 'RECETTES' : 'DEPENSES';
        } else {
          section = 'FONCTIONNEMENT';
          type = 'DEPENSES';
        }
    
        currentModalState = {
          isOpen: true,
          selectedCategory: category,
          section,
          type,
          valueField: 'REALISATIONS_2024'
        };
    
        const openModalEvent = new CustomEvent('openDrillDownModal', {
          detail: currentModalState
        });
        document.dispatchEvent(openModalEvent);
      });
    
      document.addEventListener('closeDrillDownModal', () => {
        currentModalState.isOpen = false;
      });
    }
    
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
        setupDrillDownEvents();
      }, 100);
    });
    </script>

    <!-- Contenu principal (masqué sur petits écrans) -->
    <div class="finances-section">
      <div class="finances-layout">
      <!-- Navigation fixe à gauche -->
      <aside class="finances-sidebar">
        <FinanceNavigation client:load />
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
          <div class="download-section">
            <h3 class="download-title">Documents de référence</h3>
            <div class="download-buttons">
              <a href="/assets/datas/2025/Budget-primitif-2025-Putanges.pdf" class="download-btn download-pdf" download>
                <span class="download-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </span>
                <span class="download-text">
                  <span class="download-label">Budget complet</span>
                  <span class="download-format">Format PDF</span>
                </span>
              </a>
                   <a href="/assets/datas/2025/Budget-primitif-2025.ods" class="download-btn download-csv" download>
                <span class="download-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="15" y2="9"/>
                    <line x1="9" y1="12" x2="15" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </span>
                <span class="download-text">
                  <span class="download-label">Budget complet</span>
                  <span class="download-format">Format ODS</span>
                </span>
              </a>
            </div>
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
            <div class="tabs">
              <button class="tab tab-active" data-tab="depenses" data-section="fonctionnement-donut">
                Dépenses
              </button>
              <button class="tab" data-tab="recettes" data-section="fonctionnement-donut">
                Recettes
              </button>
            </div>
          </div>

          <!-- Graphique Fonctionnement (Donut) -->
          <div class="chart-wrapper" id="chart-fonctionnement">
            <DonutChart 
              data={fonctionnementDepenses}
              title="Dépenses - Fonctionnement - Réalisations 2024"
              chartId="chart-fonctionnement"
              enableDrillDown={true}
              client:load
            />
          </div>

          <!-- Commentaire sur les réalisations -->
          <div class="realization-comment">
            <div class="comment-content">
              <h3><svg class="analysis-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg> Analyse des réalisations budgétaires</h3>
              <p>
                Explication des écarts entre prévision, réalisation et proposition. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dui massa, semper in placerat eget, iaculis eu justo. Morbi et risus eget erat cursus lobortis. Sed porttitor nisi mattis mauris consequat imperdiet. Donec eget bibendum eros. Donec elit neque, porttitor sed dictum eget, blandit eu neque. Suspendisse at orci vitae nisi blandit rhoncus vitae ut mi. Nullam ultrices volutpat lectus.
              </p>
              <div class="cta-container">
                <button class="cta" on:click={() => toggleAccordion('accordion-fonctionnement')} aria-expanded={accordions['accordion-fonctionnement']}>
                  <span class="cta-text">
                    {accordions['accordion-fonctionnement']
                      ? ACCORDION_LABELS['accordion-fonctionnement'].open
                      : ACCORDION_LABELS['accordion-fonctionnement'].closed}
                  </span>                  <svg class="cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <button class="cta" on:click={() => toggleAccordion('accordion-fonctionnement-chapitre')} aria-expanded={accordions['accordion-fonctionnement-chapitre']}>
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
                  <button class="tab tab-active" data-tab="depenses" data-section="fonctionnement-bar">
                    Dépenses
                  </button>
                  <button class="tab" data-tab="recettes" data-section="fonctionnement-bar">
                    Recettes
                  </button>
                </div>
              </div>

              <!-- Graphique de comparaison -->
              <div class="chart-wrapper" id="bar-fonctionnement">
                <HorizontalBarChart 
                  data={barChartFonctionnementDepensesChapitre}
                  type="expenses"
                  title="Comparaison des dépenses par chapitre (Prévus, Réalisés, Propositions)"
                  client:load
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
                <button class="tab tab-active" data-tab="depenses" data-section="fonctionnement-table">
                  Dépenses
                </button>
                <button class="tab" data-tab="recettes" data-section="fonctionnement-table">
                  Recettes
                </button>
              </div>
            </div>

            <!-- Graphique de comparaison -->
            <div class="chart-wrapper" id="table-fonctionnement">
              <FinancialTable 
                data={overviewFonctionnementDepenses}
                type="expenses"
                title="Dépenses de fonctionnement détaillées"
                rawData={financialTableFonctionnementDepenses}
                client:load
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
              <button class="tab tab-active" data-tab="depenses" data-section="investissement">
                Dépenses
              </button>
              <button class="tab" data-tab="recettes" data-section="investissement">
                Recettes
              </button>
            </div>
          </div>

          <!-- Graphique Investissement -->
          <div class="chart-wrapper" id="chart-investissement">
            <DonutChart 
              data={investissementDepenses}
              title="Dépenses - Investissement - Réalisations 2024"
              chartId="chart-investissement"
              enableDrillDown={true}
              client:load
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
                <button class="cta" on:click={() => toggleAccordion('accordion-investissement')} aria-expanded={accordions['accordion-investissement']}>
                  <span class="cta-text">Voir la comparaison prévisions vs réalisations</span>
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
                  <button class="tab tab-active" data-tab="depenses" data-section="investissement-bar">
                    Dépenses
                  </button>
                  <button class="tab" data-tab="recettes" data-section="investissement-bar">
                    Recettes
                  </button>
                </div>
              </div>

              <!-- Graphique de comparaison -->
              <div class="chart-wrapper" id="bar-investissement">
                <HorizontalBarChart 
                  data={barChartInvestissementDepensesChapitre}
                  type="expenses"
                  title="Comparaison des dépenses par chapitre (Prévus, Réalisés, Propositions)"
                  chartId="bar-investissement"
                  client:load
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
              client:load
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
              client:load
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
      budgetData={budgetData}
      client:only="svelte"
    />

    
    <style>
      .finances-main {
        min-height: 100vh;
        background-color: #f9fafb;
        max-width: 1600px;
      }
    
      /* Message d'avertissement - masqué par défaut */
      .screen-warning {
        display: none;
        min-height: 100vh;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: #f8f9fa;
      }
    
      .warning-content {
        max-width: 600px;
        text-align: center;
        background: white;
        padding: 3rem;
        border-radius: 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border: 2px solid #2e8b57;
      }
    
      .warning-content h2 {
        color: #2e8b57;
        margin-bottom: 1.5rem;
        font-size: 2rem;
      }
    
      .warning-content p {
        color: #495057;
        margin-bottom: 1rem;
        line-height: 1.6;
        font-size: 1.1rem;
      }
    
      .warning-details {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 1rem;
        margin: 2rem 0;
        border-left: 4px solid #2e8b57;
      }
    
      .warning-details p {
        margin-bottom: 0.5rem;
        font-size: 1rem;
      }
    
      .btn-home {
        display: inline-block;
        padding: 1rem 2rem;
        background: #2e8b57;
        color: white;
        text-decoration: none;
        border-radius: 0.5rem;
        font-weight: 600;
        transition: all 0.2s ease;
        margin-top: 1rem;
      }
    
      .btn-home:hover {
        background: #1b5e39;
        transform: translateY(-2px);
      }
    
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
        margin-bottom: 2rem;
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
    
      /* Section de téléchargement */
      .download-section {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(46, 139, 87, 0.1);
      }
    
      .download-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--primary);
        margin-bottom: 1.5rem;
        text-align: center;
      }
    
      .download-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
      }
    
      .download-btn {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }
    
      .download-pdf {
        background: var(--primary);
        color: white;
      }
    
      .download-pdf:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(46, 139, 87, 0.3);
      }
    
      .download-csv {
        background: #f8fafc;
        color: var(--primary);
        border-color: var(--primary);
      }
    
      .download-csv:hover {
        background: var(--primary);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(46, 139, 87, 0.2);
      }
    
      .download-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 24px;
        height: 24px;
      }
    
      .download-text {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    
      .download-label {
        font-weight: 600;
        font-size: 1rem;
      }
    
      .download-format {
        font-size: 0.875rem;
        opacity: 0.8;
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
    
      .section-header p {
        font-size: 1rem;
        color: var(--secondary);
        margin: 0;
      }
    
      .tabs-container {
        margin-bottom: 2rem;
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
    
      .tab-active {
        color: var(--primary) !important;
        border-bottom-color: var(--primary) !important;
        background-color: #f5faff;
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
    
      .cta-accordion:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(46, 139, 87, 0.4);
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
      .cta.active .cta-icon {
        transform: rotate(180deg);
      }
    
      .accordion-wrapper.expanded {
        max-height: 2000px; /* Valeur suffisamment grande pour le contenu */
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
  
      /* Responsive pour les grands écrans */
      @media (min-width: 1400px) and (max-width: 1599px) {
        .finances-layout {
          gap: 1.5rem;
          padding: 1.5rem;
        }
      }
    
      /* Responsive pour l'introduction et les téléchargements */
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
    
        .download-section {
          padding: 1.5rem;
        }
    
        .download-buttons {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
    
        .download-btn {
          padding: 0.875rem 1.25rem;
        }
    
        .download-title {
          font-size: 1.2rem;
        }
        
    
      }  .drill-down-legend {
        margin-top: 2rem;
        background: #ffa60021;
        border-radius: 1rem;
        color: var(--secondary);
        padding : 1rem;
        border-left: 4px solid #ffa500;
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);
     
     
    
      }
      @keyframes gentle-pulse {
        0%, 100% { opacity: 0.8; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.12); }
      }
    
    </style>