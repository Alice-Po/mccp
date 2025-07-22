<!--
  =============================================================================
  COMPOSANT: DRILL DOWN MODAL - MODAL POUR AFFICHAGE DU NIVEAU 2 (SVELTE 5)
  =============================================================================
  
  Modal qui s'ouvre lors du clic sur un segment du donut principal
  Affiche un nouveau donut avec les données de niveau 2 (regroupement_focale_n2)
  ⚡ Migré vers les runes Svelte 5
-->

<script lang="ts">
  import DonutChart from './DonutChart.svelte';
  import type { AggregatedData, BudgetItem } from '../utils/budget-data';
  import { aggregateDataLevel2 } from '../utils/budget-data';

  // Props avec les runes Svelte 5
  let { budgetData = [] }: { budgetData: BudgetItem[] } = $props();
  
  // État local réactif avec $state
  let isOpen = $state(false);
  let selectedCategory = $state('');
  let section = $state('');
  let type = $state('');
  let valueField = $state<keyof BudgetItem>('REALISATIONS_2024');

  // Valeurs dérivées avec $derived
  let level2Data = $derived(
    selectedCategory && budgetData.length > 0 
      ? aggregateDataLevel2(budgetData, section, type, valueField, selectedCategory)
      : []
  );

  let modalTitle = $derived(`${selectedCategory} - ${section} ${type}`);

  function closeModal() {
    isOpen = false;
    
    // Dispatcher un événement global pour informer la page
    if (typeof document !== 'undefined') {
      const closeEvent = new CustomEvent('closeDrillDownModal');
      document.dispatchEvent(closeEvent);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  // Écouter les événements d'ouverture de la modal
  function handleOpenModal(event: CustomEvent) {
    console.log('🔔 DrillDownModal - Événement openDrillDownModal reçu:', event.detail);
    
    const { isOpen: shouldOpen, selectedCategory: category, section: sec, type: typ, valueField: field } = event.detail;
    
    isOpen = shouldOpen;
    selectedCategory = category;
    section = sec;
    type = typ;
    valueField = field;
    
    console.log('📋 DrillDownModal - État mis à jour:', { isOpen, selectedCategory, section, type });
  }

  // Effet pour gérer les event listeners (remplace onMount/onDestroy)
  $effect(() => {
    // Vérifier que nous sommes côté client
    if (typeof document !== 'undefined') {
      // Écouter l'événement d'ouverture de la modal
      document.addEventListener('openDrillDownModal', handleOpenModal as EventListener);
      
      // Cleanup automatique lors de la destruction du composant
      return () => {
        document.removeEventListener('openDrillDownModal', handleOpenModal as EventListener);
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
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
  >
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{modalTitle}</h2>
        <button 
          class="modal-close" 
          onclick={closeModal}
          aria-label="Fermer la modal"
        >
          ✕
        </button>
      </div>

      <div class="modal-body">
        {#if level2Data.length > 0}
          <DonutChart 
            data={level2Data} 
            title="Détail par sous-catégorie"
            chartId="drill-down-{selectedCategory}"
          />
        {:else}
          <div class="no-data">
            <p>Aucune donnée disponible pour cette catégorie</p>
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