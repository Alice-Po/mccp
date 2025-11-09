<script lang="ts">
  export let isOpen: boolean;
  export let title: string;
  export let data: Array<{
    compte: string;
    libelle: string;
    prevus_2024: number;
    realises_2024: number;
    propositions_2025: number;
    type: 'expense' | 'income';
  }> = [];
  export let sectionType: string;
  export let onClose: () => void;
  import type { DrillDownItem } from '../../types';

  // Fonction pour formater les montants en français
  function formatCurrency(amount: number): string {
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }) + ' €';
  }

  // Fonction utilitaire pour calculer l'écart en pourcentage
  function getEcartPourcentage(prevu: number, realise: number): number {
    if (!prevu) return 0;
    return ((realise - prevu) / prevu) * 100;
  }
  // Fonction utilitaire pour la classe couleur selon l'écart
  function getEcartColorClass(ecart: number): string {
    const abs = Math.abs(ecart);
    if (abs < 5) return 'ecart-vert';
    if (abs < 15) return 'ecart-orange';
    return 'ecart-rouge';
  }

  // Calcul des totaux
  $: totals = {
    prevus_2024: data.reduce((sum: number, item: DrillDownItem) => sum + item.prevus_2024, 0),
    realises_2024: data.reduce((sum: number, item: DrillDownItem) => sum + item.realises_2024, 0),
    propositions_2025: data.reduce((sum: number, item: DrillDownItem) => sum + item.propositions_2025, 0)
  };

  // Calcul des totaux généraux pour toutes les lignes
  $: grandTotal = {
    prevus_2024: data.reduce((sum, i) => sum + (i.prevus_2024 || 0), 0),
    realises_2024: data.reduce((sum, i) => sum + (i.realises_2024 || 0), 0),
    propositions_2025: data.reduce((sum, i) => sum + (i.propositions_2025 || 0), 0)
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

<!-- /**
 * Props :
 * - isOpen : affichage de la modale
 * - title : titre de la modale
 * - data : données détaillées à afficher (DrillDownItem[])
 * - sectionType : type de section pour le code couleur
 * - onClose : callback de fermeture
 */ -->

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
        <div class="drilldown-table-wrapper">
          <table class="drilldown-table">
            <thead>
              <tr>
                <th>Compte</th>
                <th>Libellé</th>
                <th>Prévus 2024</th>
                <th>Réalisés 2024</th>
                <th>Écart 2024 (€)</th>
                <th>Propositions 2025</th>
              </tr>
            </thead>
            <tbody>
              {#each data as item}
                <tr>
                  <td>{item.compte}</td>
                  <td>{item.libelle}</td>
                  <td>{formatCurrency(item.prevus_2024)}</td>
                  <td>{formatCurrency(item.realises_2024)}</td>
                  <td class={getEcartColorClass(getEcartPourcentage(item.prevus_2024, item.realises_2024))}>
                    {#if item.prevus_2024}
                      {formatCurrency(item.realises_2024 - item.prevus_2024)}
                    {:else}
                      —
                    {/if}
                  </td>
                  <td>{formatCurrency(item.propositions_2025)}</td>
                </tr>
              {/each}
            </tbody>
            <tfoot>
              <tr class="grand-total">
                <td></td>
                <td><strong>Total général</strong></td>
                <td><strong>{formatCurrency(grandTotal.prevus_2024)}</strong></td>
                <td><strong>{formatCurrency(grandTotal.realises_2024)}</strong></td>
                <td class={getEcartColorClass(getEcartPourcentage(grandTotal.prevus_2024, grandTotal.realises_2024))}><strong>
                  {#if grandTotal.prevus_2024}
                    {formatCurrency(grandTotal.realises_2024 - grandTotal.prevus_2024)}
                  {:else}
                    —
                  {/if}
                </strong></td>
                <td><strong>{formatCurrency(grandTotal.propositions_2025)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
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
    width: 900px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: background-color 0.3s ease;
  }

  .modal-header {
    padding: 1rem 1.2rem;
    color: var(--secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.3s ease;
  }

  .modal-header h2 {
    margin: 0;
    font-family: var(--font-main);
    font-size: 1.1rem;
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

  .drilldown-table-wrapper {
    overflow-x: auto;
  }

  .drilldown-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-main);
    font-size: 0.85rem;
  }
  .drilldown-table thead {
    background-color: var(--secondary);
    color: white;
  }
  .drilldown-table th {
    padding: 0.4rem 0.3rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background-color: var(--secondary);
    color: white;
  }
  .drilldown-table td {
    padding: 0.4rem 0.3rem;
    border-bottom: 1px solid #f1f3f4;
    vertical-align: middle;
    color: var(--secondary);
    text-align: center;
    font-size: 0.85rem;
  }
  .drilldown-table td:nth-child(2) {
    text-align: left;
  }
  .grand-total td {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--primary);
    background: #f0f4f8;
    padding: 0.6rem 0.3rem;
    border-bottom: none;
  }
  .ecart-vert {
    color: #228B22;
    font-weight: bold;
    background: #eafbe7;
  }
  .ecart-orange {
    color: #e67e22;
    font-weight: bold;
    background: #fff6e5;
  }
  .ecart-rouge {
    color: #c0392b;
    font-weight: bold;
    background: #fdeaea;
  }

  /* Responsive design */
  @media (max-width: 1024px) {
    .modal-content {
      width: 95vw;
      max-height: 95vh;
    }
    .drilldown-table {
      font-size: 0.8rem;
    }
    .drilldown-table th,
    .drilldown-table td {
      padding: 0.3rem 0.2rem;
    }
  }

  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 1rem;
    }
    .modal-header {
      padding: 0.7rem 0.7rem;
    }
    .modal-header h2 {
      font-size: 1rem;
    }
    .drilldown-table {
      font-size: 0.75rem;
    }
    .drilldown-table th,
    .drilldown-table td {
      padding: 0.2rem 0.1rem;
    }
  }

  .detail-table thead th {
    color: white;
  }
</style> 