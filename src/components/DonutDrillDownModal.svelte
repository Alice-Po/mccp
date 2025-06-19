<script lang="ts">
  import BudgetTabs from './BudgetTabs.svelte';
  import type { DrillDownItem } from '../utils/drilldown';
  import Portal from 'svelte-portal';

  export let isOpen: boolean;
  export let title: string;
  export let drillDownData: DrillDownItem[];
  export let sectionType: string;
  export let onClose: () => void;

  // Gestion des événements clavier
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }

  // Fermer en cliquant en dehors de la popup
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  // Fonction pour obtenir la couleur de fond selon le type de section
  function getSectionColor(type: string): string {
    if (type === 'expenses') return '#FFF9C4'; // Jaune clair - dépenses de fonctionnement
    if (type === 'revenues') return '#E8F5E8'; // Vert clair - recettes de fonctionnement
    if (type === 'investment_expenses') return '#FFE5B4'; // Orange clair - dépenses d'investissement
    if (type === 'investment_revenues') return '#E5F3FF'; // Bleu clair - recettes d'investissement
    return '#FFFFFF';
  }

  // Préparer les données pour BudgetTabs.svelte
  $: budgetTabsData = drillDownData.map(item => ({
    label: item.libelle,
    compte: item.compte,
    prevus_2024: item.prevus_2024,
    realises_2024: item.realises_2024,
    propositions_2025: item.propositions_2025,
    color: getColorForItem(item.libelle, sectionType)
  }));

  // DEBUG : afficher la structure des données passées à la modale
  console.log('budgetTabsData pour la modale :', budgetTabsData);

  // Fonction pour générer des couleurs cohérentes
  function getColorForItem(libelle: string, type: string): string {
    const colors = {
      expenses: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
      ],
      revenues: [
        '#52C41A', '#1890FF', '#722ED1', '#13C2C2', '#FA8C16',
        '#EB2F96', '#A0D911', '#2F54EB', '#FA541C', '#722ED1'
      ]
    };
    
    const colorIndex = libelle.length % colors[type as keyof typeof colors]?.length || 0;
    return colors[type as keyof typeof colors]?.[colorIndex] || '#666666';
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <Portal target="body">
    <div
      class="modal-backdrop"
      role="dialog"
      tabindex="0"
      aria-modal="true"
      on:click={handleBackdropClick}
      on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
    >
      <div class="modal-content">
        <div class="modal-header" style="background: {getSectionColor(sectionType)}">
          <h2>{title}</h2>
          <button class="close-btn" on:click={onClose} aria-label="Fermer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <BudgetTabs
            data={budgetTabsData}
            type={sectionType.includes('expenses') ? 'expenses' : 'revenues'}
            drillDownData={{}}
          />
        </div>

        <div class="modal-footer">
          <button class="close-modal-btn" on:click={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  </Portal>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rem 2rem 2rem 2rem;
    overflow-y: auto;
  }

  .modal-content {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    max-width: 900px;
    max-height: 90vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 2100;
    margin: auto;
  }

  .modal-header {
    padding: 1.5rem 2rem;
    color: var(--secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: inherit;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .modal-header h2 {
    margin: 0;
    font-family: var(--font-main);
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--secondary);
  }

  .close-btn {
    background: rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--secondary);
  }

  .close-btn:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  .modal-body {
    flex: 1;
    overflow: auto;
    padding: 2rem;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Légende du donut responsive */
  :global(.legend) {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 60vh;
    overflow-y: auto;
    margin-top: 2rem;
    width: 100%;
  }
  :global(.legend-item) {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .modal-footer {
    padding: 1.5rem 2rem;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: flex-end;
  }

  .close-modal-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .close-modal-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }

  @media (max-width: 1200px) {
    .modal-content {
      width: 98vw;
      max-height: 95vh;
    }
    .modal-body {
      padding: 1rem;
    }
  }

  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 2rem 0.5rem 0.5rem 0.5rem;
    }
    .modal-header {
      padding: 1rem 1.5rem;
    }
    .modal-header h2 {
      font-size: 1.2rem;
    }
    .modal-body {
      padding: 0.5rem;
    }
    :global(.legend) {
      max-height: 30vh;
      font-size: 0.9rem;
    }
  }
</style>
