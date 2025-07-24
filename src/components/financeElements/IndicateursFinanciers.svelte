<!--
  =============================================================================
  COMPOSANT: INDICATEURS FINANCIERS - TABLEAU DES INDICATEURS FINANCIERS
  =============================================================================
  
  Affiche les indicateurs financiers de Putanges-le-Lac comparés à l'échantillon
  de communes similaires avec classements et statistiques.
-->

<script lang="ts">
  import MethodologyModal from './MethodologyModal.svelte';

  interface IndicateurFinancier {
    critere: string;
    definition_critere: string;
    valeur_putanges_le_lac_par_habitant: string;
    mediane_echantillon_par_habitant: string;
    classement_putanges_le_lac_sur_129: string;
    premier_decile_par_habitant: string;
    dernier_decile_par_habitant: string;
    commentaires: string;
  }

  // Props avec les runes Svelte 5
  let { 
    data = []
  }: {
    data: IndicateurFinancier[];
  } = $props();

  // Variables pour la gestion de la modale
  let modalOpen = $state(false);

  // Fonctions pour la gestion de la modale
  function openModal() {
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
  }

  // Fonction pour formater le nom du critère
  function formatCritereName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Fonction pour extraire la valeur numérique d'une chaîne
  function parseValue(value: string): number {
    return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
  }

 
    
  

  // Calcul des données processées
  let processedData = $derived(data.map(item => {
    const classement = parseInt(item.classement_putanges_le_lac_sur_129);
    
    return {
      ...item,
      classement,
      formattedName: formatCritereName(item.critere),
      putangesValue: parseValue(item.valeur_putanges_le_lac_par_habitant),
      medianeValue: parseValue(item.mediane_echantillon_par_habitant)
    };
  }));
</script>

<div class="indicateurs-container">
  <div class="section-intro">
    <p>Analyse des principaux indicateurs financiers de Putanges-le-Lac comparés aux communes françaises comparables.</p>
    <button class="help-button" onclick={openModal}>
      <span>Voir la méthodologie de comparaison</span>
    </button>
  </div>

  <div class="indicateurs-grid">
    {#each processedData as item}
      <div class="indicator-card">
        <div class="indicator-header">
          <h3 class="indicator-name">{item.formattedName}</h3>
          
        </div>

        <div class="indicator-definition">
          <p>{item.definition_critere}</p>
        </div>

        <div class="indicator-comparison">
          <div class="comparison-layout">
            <div class="value-card local-value">
              <div class="value-header">
                <span class="value-label">Putanges-le-Lac</span>
                <span class="ranking-badge">#{item.classement}/129</span>
              </div>
              <div class="value-amount">{item.valeur_putanges_le_lac_par_habitant}</div>
            </div>
            
            <div class="value-card reference-value">
              <div class="value-header">
                <span class="value-label">Médiane échantillon</span>
                <span class="sample-info">129 communes</span>
              </div>
              <div class="value-amount">{item.mediane_echantillon_par_habitant}</div>
            </div>
          </div>

          <div class="deciles-info">
            <div class="decile-item">
              <span class="decile-label">Premier décile (10% supérieur) :</span>
              <span class="decile-value">{item.premier_decile_par_habitant}</span>
            </div>
            <div class="decile-item">
              <span class="decile-label">Dernier décile (10% inférieur) :</span>
              <span class="decile-value">{item.dernier_decile_par_habitant}</span>
            </div>
          </div>
        </div>

        <div class="indicator-analysis">
          <div class="analysis-header">
            <h4>
              <svg class="analysis-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Analyse
            </h4>
          </div>
          <div class="analysis-content">
            <p>{item.commentaires}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>    
  </div>

  
<!-- Utilisation du composant MethodologyModal -->
<MethodologyModal isOpen={modalOpen} onClose={closeModal} />

<style>
  .indicateurs-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  .help-button {
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
    padding: 0.6rem 1.2rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    text-decoration: none;
    margin-bottom: 2rem;
  }

  .help-button:hover {
    background: var(--primary);
    color: white;
  }

  .help-icon {
    font-size: 1.1rem;
  }

  .indicateurs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .indicator-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(46, 139, 87, 0.1);
    transition: all 0.3s ease;
  }

  .indicator-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  .indicator-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .indicator-name {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--primary);
    margin: 0;
  }

  .performance-badge {
    font-size: 1.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: #f8fafc;
  }

  .performance-badge.excellent {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  }

  .performance-badge.bon {
    background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  }

  .performance-badge.moyen {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  }

  .indicator-definition {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    border-left: 3px solid var(--primary);
  }

  .indicator-definition p {
    font-size: 0.9rem;
    color: #475569;
    margin: 0;
    line-height: 1.5;
    font-style: italic;
  }

  .comparison-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .value-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.25rem;
    text-align: center;
  }

  .local-value {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-color: #bbf7d0;
  }

  .reference-value {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border-color: #cbd5e1;
  }

  .value-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .value-label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
  }

  .ranking-badge {
    font-size: 0.7rem;
    background: var(--primary);
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 600;
  }

  .sample-info {
    font-size: 0.7rem;
    background: #e2e8f0;
    color: #475569;
    padding: 0.2rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 500;
  }

  .value-amount {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1e293b;
  }

  .deciles-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: #f1f5f9;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .decile-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .decile-label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
  }

  .decile-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
  }

  .indicator-analysis {
    margin-top: 1.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 1rem;
    padding: 1.5rem;
    border-left: 4px solid var(--secondary);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }

  .indicator-analysis .analysis-header h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--secondary);
    margin: 0 0 0.75rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .analysis-icon {
    color: var(--secondary);
    flex-shrink: 0;
  }

  /* Section Conclusion */
  .conclusion-section {
    margin-top: 3rem;
    background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
    border-radius: 1.5rem;
    padding: 2.5rem;
    border: 2px solid var(--primary);
    box-shadow: 0 8px 30px rgba(46, 139, 87, 0.1);
    position: relative;
  }

  .conclusion-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
    border-radius: 1.5rem 1.5rem 0 0;
  }

  .conclusion-header h2 {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--primary);
    margin: 0 0 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .conclusion-icon {
    color: var(--primary);
    flex-shrink: 0;
  }

  .conclusion-content p {
    font-size: 1.1rem;
    color: #374151;
    line-height: 1.8;
    margin: 0 0 1.5rem 0;
    font-weight: 400;
  }

  .conclusion-content p:last-child {
    margin-bottom: 0;
  }

  .indicator-analysis .analysis-content p {
    font-size: 1rem;
    color: var(--secondary);
    line-height: 1.7;
    margin: 0;
    font-weight: 500;
  }

  /* Section Source */
  .source-section {
    margin-top: 2rem;
    padding: 1rem 0;
    border-top: 1px solid #e2e8f0;
  }

  .source-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
  }

  .source-label {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 500;
  }

  .source-text {
    font-size: 0.9rem;
    color: #475569;
    font-style: italic;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .indicateurs-container {
      padding: 0 1rem;
    }

    .indicateurs-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .indicator-card {
      padding: 1.5rem;
    }

    .indicator-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .comparison-layout {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .deciles-info {
      padding: 0.75rem;
    }

    .decile-item {
      flex-direction: column;
      gap: 0.25rem;
      align-items: flex-start;
    }

    .help-button {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }

    .source-content {
      flex-direction: column;
      gap: 0.25rem;
    }

    .indicator-analysis {
      padding: 1rem;
      margin-top: 1rem;
    }

    .indicator-analysis .analysis-header h4 {
      font-size: 1rem;
    }

    .indicator-analysis .analysis-content p {
      font-size: 0.95rem;
    }

    .conclusion-section {
      margin-top: 2rem;
      padding: 1.5rem;
    }

    .conclusion-header h2 {
      font-size: 1.4rem;
    }

    .conclusion-content p {
      font-size: 1rem;
      margin: 0 0 1rem 0;
    }
  }
</style> 