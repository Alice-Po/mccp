<script lang="ts">
  export let data: OverviewData;
  export let rawData: BudgetItem[]; // nouvelle prop : tableau brut
  import FinancialTableDrillDownModal from './FinancialTableDrillDownModal.svelte';
  import { onMount } from 'svelte';
  import type { DrillDownItem } from '../../utils/drilldown';
  import type { BudgetItem } from '../../utils/budget-data';

  interface OverviewData {
    metadata: {
      title: string;
      periods: {
        budget_2024: string;
        actual_2024: string;
        budget_2025: string;
      };
      columns: {
        compte: string;
        libelle: string;
        prevus_2024: string;
        realises_2024: string;
        propositions_2025: string;
        notes: string;
      };
    };
    sections: Array<{
      type: string;
      title: string;
      highlight_color?: string;
      items: Array<{
        compte?: string;
        libelle: string;
        prevus_2024: number;
        realises_2024: number;
        propositions_2025: number;
        notes: string;
      }>;
      total?: {
        libelle: string;
        prevus_2024: number;
        realises_2024: number;
        propositions_2025: number;
      };
    }>;
  }

  let showDownloadPopup = false;
  let showDrillDownModal = false;
  let selectedDrillDownTitle = '';
  let selectedDrillDownData: DrillDownItem[] = [];
  let selectedSectionType = '';

  // Test simple - log quand le composant se charge
  console.log('🔍 FinancialTable - Composant chargé');

  // Fonction pour formater les montants en français
  function formatCurrency(amount: number): string {
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }) + ' €';
  }

  // Fonction pour déterminer la couleur de fond selon le type de section
  function getSectionColor(type: string, highlight_color?: string): string {
    if (type === 'expenses') return '#FFF9C4'; // Jaune clair - fonctionnement
    if (type === 'revenues') return '#E8F5E8'; // Vert clair - fonctionnement
    if (type === 'investment_expenses') return '#FFE5B4'; // Orange clair - investissement
    if (type === 'investment_revenues') return '#E5F3FF'; // Bleu clair - investissement
    if (type === 'balance') return '#F0F4F8'; // Gris-bleu clair
    return '#FFFFFF';
  }

  function toggleDownloadPopup() {
    showDownloadPopup = !showDownloadPopup;
  }

  function closeDownloadPopup() {
    showDownloadPopup = false;
  }

  // Drill-down dynamique : filtrer rawData sur le libellé cliqué
  function openDrillDown(libelle: string, sectionType: string) {
    console.log('[DrillDown] Clic sur libelle:', libelle, 'sectionType:', sectionType);
    if (!rawData) {
      console.log('[DrillDown] Pas de rawData');
      return;
    }
    // On prend tous les postes du budget qui ont ce libellé (pour la section concernée)
    const details = rawData.filter(item => item.CHAPITRE_officiel === libelle);
    console.log('[DrillDown] Résultat du filtrage:', details);
    if (details.length > 0) {
      selectedDrillDownTitle = libelle;
      selectedDrillDownData = details.map(item => ({
        compte: item.COMPTE,
        libelle: item.LIBELLE,
        prevus_2024: item.PREVISIONS_2024 || 0,
        realises_2024: item.REALISATIONS_2024 || 0,
        propositions_2025: item.PROPOSITIONS_2025 || 0,
        type: sectionType.includes('revenu') ? 'income' : 'expense'
      }));
      selectedSectionType = sectionType;
      showDrillDownModal = true;
      console.log('[DrillDown] Données passées à la modale:', selectedDrillDownData);
    } else {
      console.log('[DrillDown] Aucun détail trouvé pour ce libellé');
    }
  }

  // Fonction pour fermer le drill-down
  function closeDrillDownModal() {
    showDrillDownModal = false;
    selectedDrillDownTitle = '';
    selectedDrillDownData = [];
  }

  // Gestion des événements clavier
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (showDownloadPopup) {
        closeDownloadPopup();
      }
      if (showDrillDownModal) {
        closeDrillDownModal();
      }
    }
  }

  // Détecter le type de budget pour le téléchargement
  function getCsvFileName(): string {
    const title = data?.metadata?.title?.toLowerCase() || '';
    if (title.includes('fonctionnement')) {
      return '/assets/datas/Budget-primitif-2025-section-fonctionnement.csv';
    }
    if (title.includes('investissement')) {
      return '/assets/datas/Budget-primitif-2025-section-investissement.csv';
    }
    // fallback
    return '/assets/datas/Budget-primitif-2025-section-fonctionnement.csv';
  }

  // Calcul des totaux généraux pour toutes les sections/items
  $: grandTotal = {
    prevus_2024: data.sections.reduce((sum, section) => sum + section.items.reduce((s, i) => s + (i.prevus_2024 || 0), 0), 0),
    realises_2024: data.sections.reduce((sum, section) => sum + section.items.reduce((s, i) => s + (i.realises_2024 || 0), 0), 0),
    propositions_2025: data.sections.reduce((sum, section) => sum + section.items.reduce((s, i) => s + (i.propositions_2025 || 0), 0), 0)
  };

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
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="financial-table-container">
  <div class="table-header">
    <div class="header-content">
      <h2>{data.metadata.title}</h2>
      <a class="download-btn" href={getCsvFileName()} download aria-label="Télécharger les données">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </a>
    </div>
  </div>

  <div class="table-wrapper">
    <table class="financial-table">
      <thead>
        <tr>
          <th class="col-compte">{data.metadata.columns.compte}</th>
          <th class="col-libelle">{data.metadata.columns.libelle}</th>
          <th class="col-amount">{data.metadata.columns.prevus_2024}</th>
          <th class="col-amount">{data.metadata.columns.realises_2024}</th>
          <th class="col-amount">Écart 2024 (%)</th>
          <th class="col-amount">{data.metadata.columns.propositions_2025}</th>
        </tr>
      </thead>
      <tbody>
        {#each data.sections as section}

          
          <!-- Items de la section -->
          {#each section.items as item}
            <tr class="data-row clickable" on:click={() => openDrillDown(item.libelle, section.type)}>
              <td class="col-compte">{item.compte || ''}</td>
              <td class="col-libelle">
                {item.libelle}
                {#if rawData && rawData.some(r => r.LIBELLE === item.libelle)}
                  <span class="drill-down-indicator">🔍</span>
                {/if}
              </td>
              <td class="col-amount">{formatCurrency(item.prevus_2024)}</td>
              <td class="col-amount">{formatCurrency(item.realises_2024)}</td>
              <td class="col-amount {getEcartColorClass(getEcartPourcentage(item.prevus_2024, item.realises_2024))}">
                {#if item.prevus_2024}
                  {getEcartPourcentage(item.prevus_2024, item.realises_2024).toFixed(1)} %
                {:else}
                  —
                {/if}
              </td>
              <td class="col-amount">{formatCurrency(item.propositions_2025)}</td>
            </tr>
          {/each}
          
        
        {/each}
      </tbody>
    </table>
    <div class="grand-total-row">
      <table class="financial-table">
        <tbody>
          <tr class="grand-total">
            <td class="col-compte"></td>
            <td class="col-libelle"><strong>Total général</strong></td>
            <td class="col-amount"><strong>{formatCurrency(grandTotal.prevus_2024)}</strong></td>
            <td class="col-amount"><strong>{formatCurrency(grandTotal.realises_2024)}</strong></td>
            <td class="col-amount {getEcartColorClass(getEcartPourcentage(grandTotal.prevus_2024, grandTotal.realises_2024))}"><strong>
              {#if grandTotal.prevus_2024}
                {getEcartPourcentage(grandTotal.prevus_2024, grandTotal.realises_2024).toFixed(1)} %
              {:else}
                —
              {/if}
            </strong></td>
            <td class="col-amount"><strong>{formatCurrency(grandTotal.propositions_2025)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Modal de drill-down -->
<FinancialTableDrillDownModal 
  isOpen={showDrillDownModal}
  title={selectedDrillDownTitle}
  data={selectedDrillDownData}
  sectionType={selectedSectionType}
  onClose={closeDrillDownModal}
/>

<style>
  .financial-table-container {
    position: relative;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 3rem;
    overflow: hidden;
  }

  .table-header {
    padding: 2rem 2rem 1rem;
    background: var(--primary);
    color: white;
    text-align: center;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header-content h2 {
    color: white;
    margin: 0;
    font-family: var(--font-main);
    font-size: 1.8rem;
    font-weight: 600;
  }

  .download-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
  }

  .download-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  .download-popup {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
  }

  .popup-content {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 90%;
    text-align: center;
  }

  .popup-content h3 {
    color: var(--primary);
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  .popup-content p {
    color: var(--secondary);
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .close-popup {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .close-popup:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }

  .table-wrapper {
    overflow-x: auto;
    padding: 0;
  }

  .financial-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-main);
    font-size: 0.95rem;
  }

  .financial-table thead {
    background-color: var(--secondary);
    color: white;
  }

  .financial-table th {
    padding: 1rem 0.75rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .financial-table td {
    padding: 0.75rem;
    border-bottom: 1px solid #f1f3f4;
    vertical-align: middle;
  }

  /* Alignements spécifiques */
  .col-compte {
    text-align: center;
    font-weight: 600;
    color: var(--secondary);
    width: 8%;
    min-width: 60px;
  }

  .col-libelle {
    text-align: left;
    width: 40%;
    min-width: 200px;
    color: var(--secondary);
    position: relative;
  }

  .col-amount {
    text-align: right;
    min-width: 120px;
    font-family: 'Courier New', monospace;
    font-weight: 500;
    color: white;
    text-align: center;
  }

  /* Styles pour les en-têtes de section */
  .section-header {
    border-top: 2px solid var(--primary);
    scroll-margin-top: 120px; /* Compensation pour le header et la sidebar */
  }

  .section-header .section-title {
    padding: 1rem 0.75rem;
    font-size: 1.1rem;
    color: var(--secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: none;
    scroll-margin-top: 120px; /* Compensation pour le header et la sidebar */
  }

  /* Styles spécifiques pour les sections d'investissement */
  .section-header[id^="depenses-investissement"],
  .section-header[id^="recettes-investissement"] {
    scroll-margin-top: 140px; /* Légèrement plus de marge pour l'investissement */
  }

  /* Styles pour les totaux de section */
  .section-total {
    border-bottom: 2px solid var(--primary);
  }

  .section-total td {
    padding: 0.9rem 0.75rem;
    font-size: 1rem;
  }

  .section-total strong {
    color: var(--secondary);
    font-weight: 700;
  }

  /* Styles pour les lignes de données */
  .data-row:hover {
    background-color: #f8f9fa;
    transition: background-color 0.2s ease;
  }

  .data-row td {
    color: var(--secondary);
  }

  /* Styles pour les lignes cliquables */
  .clickable {
    cursor: pointer;
  }

  .clickable:hover {
    background-color: #e3f2fd !important;
  }

  .drill-down-indicator {
    margin-left: 0.5rem;
    font-size: 0.8rem;
    opacity: 0.7;
  }

  /* Responsive design */
  @media (max-width: 1200px) {
    .table-wrapper {
      padding: 0 1rem;
    }
    
    .financial-table {
      font-size: 0.9rem;
    }
    
    .financial-table th,
    .financial-table td {
      padding: 0.6rem 0.5rem;
    }
  }

  @media (max-width: 768px) {
    .table-header {
      padding: 1.5rem 1rem 1rem;
    }
    
    .table-header h2 {
      font-size: 1.5rem;
    }
    
    .period-tag {
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
    }
    
    .financial-table {
      font-size: 0.8rem;
    }
    
    .col-compte {
      width: 10%;
      min-width: 50px;
    }
    
    .col-libelle {
      width: 35%;
      min-width: 150px;
    }
    
    .col-amount {
      width: 18%;
      min-width: 100px;
      font-size: 0.75rem;
    }
  }

  @media (max-width: 600px) {
    .table-wrapper {
      padding: 0 0.5rem;
    }
    
    .financial-table th,
    .financial-table td {
      padding: 0.5rem 0.3rem;
    }
    
    .section-title {
      font-size: 1rem !important;
    }
  }

  .data-row.clickable {
    cursor: pointer;
  }

  .grand-total-row {
    margin-top: 1rem;
    background: #f0f4f8;
    border-top: 2px solid var(--primary);
    border-radius: 0 0 1rem 1rem;
    box-shadow: 0 2px 8px rgba(46, 139, 87, 0.08);
  }
  .grand-total td {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--primary);
    background: #f0f4f8;
    padding: 1.1rem 0.75rem;
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
</style> 