<!--
  =============================================================================
  COMPOSANT: METHODOLOGY MODAL - MODALE D'EXPLICATION DE LA MÉTHODOLOGIE
  =============================================================================
  
  Modale détaillant la méthodologie de comparaison des données fiscales
  avec les communes comparables et les critères de sélection.
-->

<script lang="ts">
  import ArrowIcon from '../commonsElements/ArrowIcon.svelte';

  interface CommuneComparaison {
    exercice: string;
    département: string;
    commune_rurale: boolean;
    commune_touristique: boolean;
    tranche_revenu_par_habitant: string;
    commune: string;
    agrégat: string;
    montant: number;
    population: number;
    montant_par_habitant: number;
  }

  interface CommuneInfo {
    commune: string;
    département: string;
    population: number;
    tranche_revenu: string;
    commune_rurale: boolean;
    commune_touristique: boolean;
  }

  // Props avec les runes Svelte 5
  let { 
    isOpen = false,
    onClose = () => {}
  }: {
    isOpen: boolean;
    onClose: () => void;
  } = $props();

  // Variables pour la gestion des données
  let communesData = $state<CommuneInfo[]>([]);
  let isLoadingCommunes = $state(false);

  // Fonction pour charger les données des communes
  async function loadCommunesData() {
    if (communesData.length > 0) return; // Déjà chargées
    
    isLoadingCommunes = true;
    try {
      const response = await fetch('/assets/datas/2025/base_comparaison_2025.json');
      const allData = await response.json();
      
      // Extraire les communes uniques avec leurs informations
      const uniqueCommunes = new Map();
      
      allData.forEach((item: CommuneComparaison) => {
        if (!uniqueCommunes.has(item.commune)) {
          uniqueCommunes.set(item.commune, {
            commune: item.commune,
            département: item.département,
            population: item.population,
            tranche_revenu: item.tranche_revenu_par_habitant,
            commune_rurale: item.commune_rurale,
            commune_touristique: item.commune_touristique
          });
        }
      });
      
      // Convertir en array et trier par département puis par commune
      communesData = Array.from(uniqueCommunes.values())
        .sort((a, b) => {
          if (a.département !== b.département) {
            return a.département.localeCompare(b.département);
          }
          return a.commune.localeCompare(b.commune);
        });
      
    } catch (error) {
      console.error('Erreur lors du chargement des communes:', error);
      communesData = [];
    } finally {
      isLoadingCommunes = false;
    }
  }

  // Fonction pour formater la tranche de revenus
  function formatTrancheRevenu(tranche: string): string {
    const tranches: Record<string, string> = {
      '1': 'Tranche 1 (faible)',
      '2': 'Tranche 2 (moyenne)',
      '3': 'Tranche 3 (élevée)',
      '4': 'Tranche 4 (très élevée)'
    };
    return tranches[tranche] || `Tranche ${tranche}`;
  }

  // Charger les données quand la modale s'ouvre
  $effect(() => {
    if (isOpen) {
      loadCommunesData();
    }
  });
</script>

{#if isOpen}
<!-- Modale de méthodologie -->
<div class="modal-overlay" onclick={onClose}>
  <div class="modal-content" onclick={(e) => e.stopPropagation()}>
    <div class="modal-header">
      <h2>Méthodologie de comparaison</h2>
      <button class="modal-close" onclick={onClose}>×</button>
    </div>
    
    <div class="modal-body">
      <div class="methodology-section">
        <h3>Échantillon de comparaison</h3>
        <p>
          <strong>Communes rurales du Calvados, de la Manche et de l'Orne</strong> peuplées de 1 000 à 3 000 habitants, 
          à l'exclusion des communes touristiques (soit un échantillon homogène de <strong>{communesData.length} communes</strong>) sur l'exercice 2023.
        </p>
      </div>

      <div class="methodology-section">
        <h3>⚠️ Remarque importante</h3>
        <p class="warning-text">
          Les comparaisons entre communes ne constituent qu'un indicateur qui doit être recontextualisé au regard 
          de l'importance des compétences transférées par la commune au niveau intercommunal.
        </p>
      </div>

      <div class="methodology-section">
        <h3>Critères de sélection</h3>
        <ul class="criteria-list">
          <li><strong>Localisation :</strong> Départements du Calvados, de la Manche et de l'Orne</li>
          <li><strong>Population :</strong> Entre 1 000 et 3 000 habitants</li>
          <li><strong>Type :</strong> Communes rurales exclusivement</li>
          <li><strong>Exclusion :</strong> Communes touristiques écartées</li>
        </ul>
      </div>

      <div class="methodology-section">
        <h3>Comment fonctionne la comparaison ?</h3>
        
        <div >
            <h4>              <ArrowIcon color="#2e8b57" size={16} direction="right" />
              L'indicateur choisi</h4>
            <p>
                Nous utilisons les <strong>"frais de personnel par habitant"</strong> comme référence de comparaison.
                Cet indicateur mesure ce que chaque commune dépense annuellement pour rémunérer ses agents
                (salaires, charges sociales, primes), divisé par le nombre d'habitants.
            </p>
            <p>C'est un indicateur stable.</p>
            
            <details class="technical-detail">
                <summary>Détail technique : qu'est-ce qui est compté ?</summary>
                <p><strong>Inclus :</strong> salaires bruts, cotisations patronales, primes et indemnités, formation du personnel</p>
                <p><strong>Exclus :</strong> indemnités des élus (comptabilisées à part), prestations sous-traitées</p>
                <p><strong>Source :</strong> chapitre 012 du budget communal</p>
            </details>
            
        <br>
            
            <h4>
              <ArrowIcon color="#2e8b57" size={16} direction="right" />
              Traitement statistique
            </h4>
            <p>
                Nous utilisons la médiane plutôt que la moyenne, ce qui permet de limiter naturellement l'impact des valeurs extrêmes sans avoir besoin d'exclure des communes.
            </p>
            
                <p>Pour vous renseigner sur la distribution des valeurs dans notre échantillon de 132 communes :</p>
                <p>• <strong>Premier décile :</strong> 9,71 € par habitant (10% des communes dépensent moins)</p>
                <p>• <strong>Dernier décile :</strong> 286,02 € par habitant (10% des communes dépensent plus)</p>
 
            
            <div class="highlight">
                <strong>Limite importante :</strong> Cet indicateur ne renseigne pas sur la qualité des services rendus,
                seulement sur leur coût. Il doit être interprété avec les autres données financières.
            </div>
        </div>
        
        <div class="comparison-stats">
          <div class="stat-grid">
            <div class="stat-item highlight">
              <div class="stat-label">Putanges-le-Lac</div>
              <div class="stat-value">252,31 €</div>
              <div class="stat-desc">par habitant</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-label">Médiane échantillon</div>
              <div class="stat-value">268,45 €</div>
              <div class="stat-desc">par habitant</div>
            </div>
            
            <div class="stat-item ranking">
              <div class="stat-label">Classement</div>
              <div class="stat-value">75<sup>e</sup></div>
              <div class="stat-desc">sur {communesData.length} communes</div>
            </div>
          </div>
        </div>
      </div>

      <div class="methodology-section">
        <h3>Sources officielles</h3>
        <div class="sources-container">
          <div class="source-item">
            <div class="source-name">
              <strong>OFGL - Observatoire des finances et de la gestion publique locales</strong>
            </div>
            <div class="source-description">
              Portail des données financières et de gestion du secteur public local
            </div>
            <a href="https://data.ofgl.fr" target="_blank" rel="noopener noreferrer" class="source-link">
              <span class="link-icon">🔗</span>
              <span>data.ofgl.fr</span>
              <span class="external-icon">↗</span>
            </a>
          </div>
          
          <div class="source-item">
            <div class="source-name">
              <strong>Direction générale des finances publiques (DGFiP)</strong>
            </div>
            <div class="source-description">
              Données fiscales et budgétaires des collectivités locales
            </div>
          </div>
        </div>
      </div>

      <div class="methodology-section">
        <h3>Communes de l'échantillon</h3>
        <div class="table-container">
          {#if isLoadingCommunes}
            <div class="loading-communes">Chargement des données...</div>
          {:else}
            <div class="table-wrapper">
              <table class="communes-table">
                <thead>
                  <tr>
                    <th>Commune</th>
                    <th>Département</th>
                    <th>Population</th>
                    <th>Tranche de revenus</th>
                  </tr>
                </thead>
                <tbody>
                  {#each communesData as commune}
                    <tr>
                      <td>{commune.commune}</td>
                      <td>{commune.département}</td>
                      <td>{commune.population.toLocaleString()} hab.</td>
                      <td>{formatTrancheRevenu(commune.tranche_revenu)}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
{/if}

<style>
  /* Styles de la modale */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
  }

  .modal-content {
    background: white;
    border-radius: 1.5rem;
    max-width: 1200px;
    max-height: 95vh;
    width: 100%;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(46, 139, 87, 0.1);
  }

  .modal-header {
    background: #2e8b57;
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
  }

  .modal-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 1.5rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
  }

  .modal-close:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .modal-body {
    padding: 2rem;
    overflow-y: auto;
    max-height: calc(95vh - 120px);
  }

  .methodology-section {
    margin-bottom: 2rem;
  }

  .methodology-section:last-child {
    margin-bottom: 0;
  }

  .methodology-section h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2e8b57;
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .methodology-section p {
    font-size: 1rem;
    color: #475569;
    line-height: 1.6;
    margin: 0;
  }

  .warning-text {
    background: #fef3c7;
    padding: 1rem;
    border-radius: 0.5rem;
    border-left: 4px solid #f59e0b;
    font-weight: 500;
    color: #92400e !important;
  }

  .criteria-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .criteria-list li {
    background: #f8fafc;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    border-left: 3px solid #2e8b57;
    font-size: 0.95rem;
    color: #475569;
  }

  .analysis-intro {
    background: #e0f2fe;
    padding: 1rem;
    border-radius: 0.5rem;
    border-left: 4px solid #0284c7;
    margin-bottom: 1.5rem;
    font-weight: 500;
    color: #0c4a6e !important;
  }

  /* Section d'explication vulgarisée */
  .explanation-box {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .explanation-box h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #0c4a6e;
    margin: 0 0 0.75rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .explanation-box h4:not(:first-child) {
    margin-top: 1.5rem;
  }

  .explanation-box p {
    font-size: 1rem;
    color: #0f172a;
    line-height: 1.7;
    margin: 0 0 0.75rem 0;
  }

  .explanation-box p:last-child {
    margin-bottom: 0;
  }

  .technical-detail {
    overflow: hidden;
  }

  .technical-detail summary {
    padding: 0.5rem 0.75rem;    
    cursor: pointer;
    background: #f1f5f9;
    border-bottom: 1px solid #e2e8f0;
    transition: background 0.2s ease;
        font-size: 0.9rem;
        margin: 0.75rem;

  }

  .technical-detail summary:hover {
    background: #e2e8f0;
  }

  .technical-detail p {
    padding: 0.75rem 1rem;
    margin: 0;
    font-size: 0.9rem;
  }

  .technical-detail p:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }

  .highlight {
    background: #fef3c7;
    border-left: 3px solid #f59e0b;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
    font-size: 0.95rem;
    color: #92400e;
  }

  .comparison-stats {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-item {
    background: white;
    padding: 1.25rem;
    border-radius: 0.75rem;
    text-align: center;
    border: 2px solid #e2e8f0;
    transition: all 0.3s ease;
  }

  .stat-item.highlight {
    border-color: #2e8b57;
    background: #f0fdf4;
  }

  .stat-item.ranking {
    border-color: #f59e0b;
    background: #fefbf0;
  }

  .stat-label {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  .stat-item.highlight .stat-value {
    color: #2e8b57;
  }

  .stat-item.ranking .stat-value {
    color: #d97706;
  }

  .stat-desc {
    font-size: 0.8rem;
    color: #64748b;
    font-style: italic;
  }

  .decile-info {
    border-top: 1px solid #e2e8f0;
    padding-top: 1.5rem;
  }

  .decile-range {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .decile-item {
    flex: 1;
    background: white;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
    text-align: center;
  }

  .decile-label {
    display: block;
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .decile-value {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
  }



  /* Section des sources */
  .sources-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .source-item {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border-left: 4px solid #2e8b57;
    transition: all 0.3s ease;
  }

  .source-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(46, 139, 87, 0.1);
  }

  .source-name {
    font-size: 1.1rem;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .source-description {
    font-size: 0.95rem;
    color: #64748b;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .source-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #2e8b57;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(46, 139, 87, 0.2);
  }

  .source-link:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(46, 139, 87, 0.3);
    background: #1b5e39;
  }

  .link-icon {
    font-size: 0.9rem;
  }

  .external-icon {
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .table-container {
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .loading-communes {
    padding: 2rem;
    text-align: center;
    color: #64748b;
    font-style: italic;
  }

  .table-wrapper {
    max-height: 400px;
    overflow-y: auto;
  }

  .communes-table {
    width: 100%;
    border-collapse: collapse;
  }

  .communes-table th {
    background: #2e8b57;
    color: white;
    padding: 1rem 0.75rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.9rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .communes-table td {
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.9rem;
    color: #475569;
  }

  .communes-table tr:nth-child(even) {
    background: #f8fafc;
  }

  .communes-table tr:hover {
    background: #f1f5f9;
  }

  /* Responsive */
  @media (max-width: 768px) {
    /* Modale responsive */
    .modal-overlay {
      padding: 1rem;
    }

    .modal-content {
      max-height: 90vh;
    }

    .modal-header {
      padding: 1.5rem;
    }

    .modal-header h2 {
      font-size: 1.3rem;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .methodology-section h3 {
      font-size: 1.1rem;
    }

    .communes-table th,
    .communes-table td {
      padding: 0.5rem;
      font-size: 0.8rem;
    }

    /* Responsive pour la section d'analyse */
    .stat-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .stat-item {
      padding: 1rem;
    }

    .stat-value {
      font-size: 1.3rem;
    }

    .decile-range {
      flex-direction: column;
      gap: 0.75rem;
    }

    .comparison-stats {
      padding: 1rem;
    }

    /* Responsive pour les sources */
    .source-item {
      padding: 1rem;
    }

    .source-name {
      font-size: 1rem;
    }

    .source-description {
      font-size: 0.9rem;
    }

    .source-link {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }

  }
</style> 