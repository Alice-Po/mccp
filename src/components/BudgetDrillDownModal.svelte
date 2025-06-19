<script lang="ts">
  export let isOpen: boolean;
  export let title: string;
  export let data: DrillDownItem[];
  export let sectionType: string;
  export let onClose: () => void;
  import type { DrillDownItem } from '../utils/drilldown';

  // Fonction pour formater les montants en français
  function formatCurrency(amount: number): string {
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }) + ' €';
  }

  // Calcul des totaux
  $: totals = {
    prevus_2024: data.reduce((sum: number, item: DrillDownItem) => sum + item.prevus_2024, 0),
    realises_2024: data.reduce((sum: number, item: DrillDownItem) => sum + item.realises_2024, 0),
    propositions_2025: data.reduce((sum: number, item: DrillDownItem) => sum + item.propositions_2025, 0)
  };

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
</script>

<svelte:window on:keydown={handleKeydown} />

/**
 * Props :
 * - isOpen : affichage de la modale
 * - title : titre de la modale
 * - data : données détaillées à afficher (DrillDownItem[])
 * - sectionType : type de section pour le code couleur
 * - onClose : callback de fermeture
 */

{#if isOpen}
  <div
    class="modal-backdrop"
    role="button"
    tabindex="0"
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
        <div class="table-wrapper">
          <table class="detail-table">
            <thead>
              <tr>
                <th class="col-compte">Compte</th>
                <th class="col-libelle">Libellé</th>
                <th class="col-amount">Prévus 2024</th>
                <th class="col-amount">Réalisés 2024</th>
                <th class="col-amount">Propositions 2025</th>
              </tr>
            </thead>
            <tbody>
              {#each data as item}
                <tr class="data-row">
                  <td class="col-compte">{item.compte}</td>
                  <td class="col-libelle">{item.libelle}</td>
                  <td class="col-amount">{formatCurrency(item.prevus_2024)}</td>
                  <td class="col-amount">{formatCurrency(item.realises_2024)}</td>
                  <td class="col-amount">{formatCurrency(item.propositions_2025)}</td>
                </tr>
              {/each}
              
              <!-- Ligne de total -->
              <tr class="total-row">
                <td class="col-compte"></td>
                <td class="col-libelle"><strong>Total</strong></td>
                <td class="col-amount"><strong>{formatCurrency(totals.prevus_2024)}</strong></td>
                <td class="col-amount"><strong>{formatCurrency(totals.realises_2024)}</strong></td>
                <td class="col-amount"><strong>{formatCurrency(totals.propositions_2025)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal-footer">
        <button class="close-modal-btn" on:click={onClose}>Fermer</button>
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
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .modal-content {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    max-width: 90vw;
    max-height: 90vh;
    width: 1200px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: background-color 0.3s ease;
  }

  .modal-header {
    padding: 1.5rem 2rem;
    color: var(--secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.3s ease;
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
    padding: 0;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .detail-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-main);
    font-size: 0.95rem;
  }

  .detail-table thead {
    background-color: var(--secondary);
    color: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .detail-table th {
    padding: 1rem 0.75rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .detail-table td {
    padding: 0.75rem;
    border-bottom: 1px solid #f1f3f4;
    vertical-align: middle;
  }

  .col-compte {
    text-align: center;
    font-weight: 600;
    color: var(--secondary);
    width: 8%;
    min-width: 60px;
  }

  .col-libelle {
    text-align: left;
    width: 50%;
    min-width: 250px;
    color: var(--secondary);
  }

  .col-amount {
    text-align: right;
    min-width: 120px;
    font-family: 'Courier New', monospace;
    font-weight: 500;
    color: var(--secondary);
  }

  .data-row:hover {
    background-color: #f8f9fa;
    transition: background-color 0.2s ease;
  }

  .total-row {
    background-color: #f0f4f8;
    border-top: 2px solid var(--primary);
  }

  .total-row td {
    padding: 1rem 0.75rem;
    font-size: 1rem;
  }

  .total-row strong {
    color: var(--secondary);
    font-weight: 700;
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

  /* Responsive design */
  @media (max-width: 1200px) {
    .modal-content {
      width: 95vw;
      max-height: 95vh;
    }
    
    .detail-table {
      font-size: 0.9rem;
    }
    
    .detail-table th,
    .detail-table td {
      padding: 0.6rem 0.5rem;
    }
  }

  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 1rem;
    }
    
    .modal-header {
      padding: 1rem 1.5rem;
    }
    
    .modal-header h2 {
      font-size: 1.3rem;
    }
    
    .detail-table {
      font-size: 0.8rem;
    }
    
    .col-compte {
      width: 10%;
      min-width: 50px;
    }
    
    .col-libelle {
      width: 45%;
      min-width: 200px;
    }
    
    .col-amount {
      width: 15%;
      min-width: 100px;
      font-size: 0.75rem;
    }
  }

  .detail-table thead th {
    color: white;
  }
</style> 