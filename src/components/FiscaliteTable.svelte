<!--
  =============================================================================
  COMPOSANT: FISCALITE TABLE - TABLEAU COMPARATIF DES TAUX DE FISCALITÉ 
  =============================================================================
  
  Affiche un tableau comparatif des taux de fiscalité entre Putanges-le-Lac 
  et la moyenne des communes françaises comparables.
  
  Fonctionnalités :
  - Tableau responsive avec barres de progression
  - Comparaison visuelle des taux
  - Tooltips avec commentaires
  - Couleurs différentielles (vert/rouge selon écart)
-->

<script lang="ts">
  import MethodologyModal from './MethodologyModal.svelte';

  interface FiscaliteItem {
    type_taxe: string;
    taux_vote_commune_putanges: string;
    taux_moyen_communes_francaises_comparables: string;
    commentaire: string;
  }

  // Props avec les runes Svelte 5
  let { 
    data = []
  }: {
    data: FiscaliteItem[];
  } = $props();

  // Fonction pour convertir les pourcentages en nombres
  function parsePercentage(percentage: string): number {
    return parseFloat(percentage.replace(',', '.').replace(' %', ''));
  }

  // Fonction pour formater le nom de la taxe
  function formatTaxeName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }



  // Calcul des données processées avec $derived (Svelte 5)
  let processedData = $derived(data.map(item => {
    const putanges = parsePercentage(item.taux_vote_commune_putanges);
    const moyenne = parsePercentage(item.taux_moyen_communes_francaises_comparables);
    
    return {
      ...item,
      putanges,
      moyenne,
      difference: putanges - moyenne,
      formattedName: formatTaxeName(item.type_taxe)
    };
  }));

  // Variables pour la gestion de la modale
  let modalOpen = $state(false);

  // Fonctions pour la gestion de la modale
  function openModal() {
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
  }
</script>

<div class="fiscalite-container">
  <div class="section-intro">
    <p>La fiscalité locale, ce sont les impôts locaux payés par les habitants et les entreprises de la commune (Taxe sur le foncier bâti,Taxe sur le foncier non bâti, Cotisation foncière des entreprises). C’est la principale ressource que la commune maîtrise directement en fixant les taux d’imposition. Nous comparons ici les taux de fiscalité locale de Putanges-le-Lac avec la moyenne des communes françaises comparables.</p>
    <button class="help-button" onclick={openModal}>
      <span>Voir la méthodologie de comparaison</span>
    </button>
  </div>

  <div class="fiscalite-table">
    {#each processedData as item}
      <div class="tax-row">
        <div class="tax-header">
          <h3 class="tax-name">{item.formattedName}</h3>
        </div>

        <div class="tax-comparison">
          <div class="comparison-layout">
            <div class="rate-card local-rate">
              <div class="rate-header">
                <span class="rate-label">Putanges-le-Lac</span>
                <span class="rate-badge">Commune</span>
              </div>
              <div class="rate-value">{item.putanges.toFixed(2)}%</div>
              
              <!-- Indicateur d'écart intégré -->
              <div class="difference-display">
                {#if Math.abs(item.difference) > 1}
                  <div class="difference-text">
                    {#if item.difference > 0}
                      <span class="diff-value positive">+{item.difference.toFixed(1)} points  au-dessus de la moyenne</span>
                    {:else}
                      <span class="diff-value negative">{item.difference.toFixed(1)} points en-dessous de la moyenne</span>
                    {/if}
                  </div>
                {:else}
                  <div class="difference-text equivalent">
                    <span class="diff-value">≈ Équivalent</span>
                    <span class="diff-desc">proche de la moyenne</span>
                  </div>
                {/if}
              </div>
            </div>
            
            <div class="rate-card reference-rate">
              <div class="rate-header">
                <span class="rate-label">Communes comparables</span>
                <span class="rate-badge">Moyenne</span>
              </div>
              <div class="rate-value">{item.moyenne.toFixed(2)}%</div>
              <div class="reference-note">
                <span class="sample-size">129 communes</span>
              </div>
            </div>
          </div>
        </div>

        <div class="tax-comment">
          <p>{item.commentaire}</p>
        </div>
      </div>
    {/each}
  </div>

  <!-- Section Analyse -->
  <div class="analysis-section">
    <div class="analysis-header">
      <h3>
        <svg class="analysis-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Analyse de la répartition fiscale
    </h3>
    </div>
    <div class="analysis-content">
      <p>
        La répartition de l'effort fiscal demandé par la commune de Putanges-le-Lac est très favorable aux entreprises et aux propriétaires de terres agricoles. Ceux-ci supportent un taux d'imposition très inférieur à la moyenne de l'échantillon de comparaison. À l'inverse, les autres propriétaires (principalement les propriétaires de leur habitation) supportent un taux d'imposition sensiblement supérieur aux taux moyen français des communes comparables.
      </p>
    </div>
  </div>
</div>

<!-- Utilisation du nouveau composant MethodologyModal -->
<MethodologyModal isOpen={modalOpen} onClose={closeModal} />

<style>
  .fiscalite-container {
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
    transform: none;
    box-shadow: none;
  }


  .analysis-icon {
    color: var(--secondary);
    flex-shrink: 0;
  }

  .help-icon {
    font-size: 1.1rem;
  }

  .fiscalite-table {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .tax-row {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(46, 139, 87, 0.1);
    transition: all 0.3s ease;
  }

  .tax-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  .tax-header {
    margin-bottom: 1rem;
  }

  .tax-name {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--primary);
    margin: 0 0 1rem 0;
  }



  .tax-comparison {
    margin-bottom: 1.5rem;
  }

  .comparison-layout {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 1.5rem;
    align-items: start;
  }

  .rate-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.25rem;
    text-align: center;
    transition: all 0.2s ease;
  }

  .rate-card:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .local-rate {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-color: #bbf7d0;
  }

  .reference-rate {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border-color: #cbd5e1;
  }

  .rate-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .rate-label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
  }

  .rate-badge {
    font-size: 0.7rem;
    background: #e2e8f0;
    color: #475569;
    padding: 0.2rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .local-rate .rate-badge {
    background: #bbf7d0;
    color: #15803d;
  }

  .rate-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
  }

  .difference-display {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }



  .difference-text {
    text-align: center;
  }

  .difference-text.equivalent {
    text-align: center;
    padding: 0.75rem 0;
  }

  .diff-value {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .diff-value.positive {
    color: #0f172a;
  }

  .diff-value.negative {
    color: #0f172a;
  }

  .diff-desc {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    font-style: italic;
  }

  .reference-note {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
    text-align: center;
  }

  .sample-size {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
  }

  .tax-comment {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 0.5rem;
    border-left: 3px solid #e2e8f0;
  }

  .tax-comment p {
    font-size: 0.95rem;
    color: #475569;
    margin: 0;
    line-height: 1.5;
    font-style: italic;
  }

  /* Section Analyse */
  .analysis-section {
    margin-top: 3rem;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 1rem;
    padding: 2rem;
    border-left: 4px solid var(--secondary);
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);
  }

  .analysis-header h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--secondary);
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .analysis-content p {
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
    max-width: 900px;
    max-height: 85vh;
    width: 100%;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(46, 139, 87, 0.1);
  }

  .modal-header {
    background: linear-gradient(135deg, var(--primary) 0%, #1b5e39 100%);
    color: white;
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
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
    max-height: calc(85vh - 120px);
  }





  /* Responsive */
  @media (max-width: 768px) {
    .fiscalite-container {
      padding: 0 1rem;
    }

    .tax-row {
      padding: 1.5rem;
    }



    .comparison-layout {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .difference-display {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
    }



    .rate-card {
      padding: 1rem;
    }

    .rate-value {
      font-size: 1.3rem;
    }

    .analysis-section {
      padding: 1.5rem;
      margin-top: 2rem;
    }

    .analysis-header h3 {
      font-size: 1.2rem;
    }

    .analysis-content p {
      font-size: 0.95rem;
    }

    .source-content {
      flex-direction: column;
      gap: 0.25rem;
    }

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

    .help-button {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }
  }
</style> 