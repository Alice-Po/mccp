<!--
  =============================================================================
  COMPOSANT: DRILL DOWN MODAL - MODAL POUR AFFICHAGE DU NIVEAU 2 (SVELTE 5)
  =============================================================================
  
  Modal qui s'ouvre lors du clic sur un segment du donut principal
  Affiche un nouveau donut avec les données de niveau 2 (regroupement_focale_n2)
  ⚡ Refactorisé proprement pour Svelte 5 - Phase 1
-->

<script lang="ts">
  import DonutChart from './DonutChart.svelte';
  import { aggregateDataLevel2 } from '../../utils/budget-data';
  import type { DrillDownModalProps, BudgetItem } from '../../types';
  import '../../styles/modal.css';

  // Props idiomatiques Svelte 5 - PAS de destructuration !
  const props = $props();

  // Valeurs dérivées réactives - maintenant ça marche !
  const isOpen = $derived(props.isOpen);
  const budgetData = $derived(props.budgetData || []);
  const modalData = $derived(props.modalData);
  const onclose = $derived(props.onclose);

  // Titre de la modal dérivé
  const modalTitle = $derived(() => {
    if (!modalData) return '';
    return `${modalData.category} - ${modalData.section} ${modalData.type}`;
  });

  // Données de niveau 2 dérivées
  const level2Data = $derived(() => {
    if (!modalData || !budgetData.length) {
      console.log('❌ Pas de données pour la modal:', { modalData: !!modalData, budgetDataLength: budgetData.length });
      return [];
    }
    
    console.log('🔍 Agrégation des données niveau 2:', {
      section: modalData.section,
      type: modalData.type,
      category: modalData.category,
      budgetDataLength: budgetData.length
    });
    
    const result = aggregateDataLevel2(
      budgetData,
      modalData.section,
      modalData.type,
      'REALISATIONS_2024', // Champ de valeur fixe
      modalData.category
    );
    
    console.log('✅ Données niveau 2 générées:', result);
    return result;
  });

  // Fonctions de gestion des événements
  function closeModal() {
    console.log('🔒 Fermeture modal via bouton');
    onclose?.();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      console.log('🔒 Fermeture modal via Échap');
      closeModal();
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      console.log('🔒 Fermeture modal via backdrop');
      closeModal();
    }
  }

  // Effet pour gérer le focus et le scroll
  $effect(() => {
    if (isOpen) {
      console.log('📖 Modal ouverte - désactiver scroll');
      document.body.style.overflow = 'hidden';
      
      return () => {
        console.log('📖 Modal fermée - réactiver scroll');
        document.body.style.overflow = '';
      };
    }
  });
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div 
    class="modal-backdrop" 
    role="dialog" 
    aria-modal="true"
    tabindex="-1"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
  >
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{modalTitle()}</h2>
        <button 
          class="modal-close" 
          onclick={closeModal}
          aria-label="Fermer la modal"
        >
          ✕
        </button>
      </div>

      <div class="modal-body">
        {#if level2Data().length > 0}
          <DonutChart 
            data={level2Data()} 
            title="Détail par sous-catégorie"
            chartId="drill-down-{modalData?.category || 'default'}"
            enableDrillDown={false}
          />
        {:else}
          <div class="no-data">
            <div class="no-data-icon">📊</div>
            <p>Aucune sous-catégorie disponible pour cette catégorie</p>
            {#if modalData}
              <div class="debug-info">
                <small>
                  Recherche dans: {modalData.section} - {modalData.type} - {modalData.category}
                </small>
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" onclick={closeModal}>
          Fermer
        </button>
      </div>
    </div>
  </div>
{/if}
<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 90%;
    max-width: 1000px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  .modal-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1B365D;
    text-transform: capitalize;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0.5rem;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .modal-close:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .modal-body {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }

  .modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
    display: flex;
    justify-content: flex-end;
  }

  .btn-secondary {
    background: #6b7280;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .btn-secondary:hover {
    background: #4b5563;
  }

  .no-data {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
  }

  .no-data p {
    font-size: 1.1rem;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .modal-content {
      width: 95%;
      max-height: 95vh;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
      padding: 1rem 1.5rem;
    }

    .modal-title {
      font-size: 1.25rem;
    }
  }
</style> 