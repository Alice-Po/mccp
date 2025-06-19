<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  export interface DonutItem {
    label: string;
    compte: string;
    prevus_2024: number;
    realises_2024: number;
    propositions_2025: number;
    color: string;
  }

  export let data: DonutItem[];
  export let type: 'expenses' | 'revenues';
  export let drillDownData: Record<string, any[]> = {};
  export let activePeriod: string;
  export let periods: { key: string; label: string }[] = [];

  let chartId = `donut-${type}-${Math.random().toString(36).substr(2, 9)}`;
  let chartInstance: any = null;
  let currentPeriod = activePeriod;
  let showModal = false;
  let modalData: any[] = [];
  let modalTitle = '';

  const dispatch = createEventDispatcher();

  function getChartData(period: string) {
    return data.map(item => ({
      label: item.label,
      value: item[period] || 0,
      compte: item.compte,
      color: item.color
    }));
  }

  function updateChart(period: string) {
    const chartData = getChartData(period);
    const labels = chartData.map(item => item.label);
    const values = chartData.map(item => item.value);
    const colors = chartData.map(item => item.color);
    const total = values.reduce((sum, v) => sum + v, 0);

    if (chartInstance) {
      chartInstance.data.labels = labels;
      chartInstance.data.datasets[0].data = values;
      chartInstance.data.datasets[0].backgroundColor = colors;
      chartInstance.update();
    }

    // Update total and label
    const totalEl = document.getElementById(`total-${chartId}`);
    if (totalEl) {
      totalEl.textContent = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(total);
    }
    const labelEl = document.getElementById(`label-${chartId}`);
    if (labelEl) {
      const periodLabel = periods.find(p => p.key === period)?.label || '';
      labelEl.textContent = `${type === 'expenses' ? 'Dépenses' : 'Recettes'} - ${periodLabel}`;
    }
  }

  function showDrillDown(detailedData: any[], categoryName: string) {
    modalData = detailedData;
    modalTitle = `Détail: ${categoryName}`;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    modalData = [];
    modalTitle = '';
  }

  onMount(async () => {
    // Chart.js doit être importé dynamiquement côté client
    const Chart = (await import('chart.js/auto')).default;
    const chartData = getChartData(activePeriod);
    const labels = chartData.map(item => item.label);
    const values = chartData.map(item => item.value);
    const colors = chartData.map(item => item.color);
    const total = values.reduce((sum, v) => sum + v, 0);

    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff',
          hoverBorderWidth: 3,
          hoverBorderColor: '#333'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        onClick: (event: any, elements: any) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const chartData = getChartData(currentPeriod);
            const compte = chartData[index].compte;
            if (compte && drillDownData[compte]) {
              showDrillDown(drillDownData[compte], chartData[index].label);
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 0
                }).format(value)} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
    updateChart(activePeriod);
  });

  $: currentPeriod = activePeriod;
  $: if (chartInstance) updateChart(currentPeriod);
</script>

<div class="donut-container">
  <div class="chart-wrapper">
    <canvas id={chartId} width="400" height="400"></canvas>
    <div class="center-text">
      <div class="total-amount" id={`total-${chartId}`}></div>
      <div class="total-label" id={`label-${chartId}`}></div>
    </div>
  </div>
  <div class="legend" id={`legend-${chartId}`}> 
    {#each getChartData(currentPeriod) as item, idx}
      <div
        class="legend-item"
        data-compte={item.compte}
        on:click={() => item.compte && drillDownData[item.compte] && showDrillDown(drillDownData[item.compte], item.label)}
        tabindex="0"
        role="button"
        on:keydown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && item.compte && drillDownData[item.compte]) {
            showDrillDown(drillDownData[item.compte], item.label);
          }
        }}
      >
        <div class="legend-text" style="display: inline-flex;">
          <div class="legend-color" style="background-color: {item.color}"></div>
          <div class="legend-label">{item.label}</div>
          <div class="legend-value">{item.value.toLocaleString('fr-FR')} €</div>
        </div>
      </div>
    {/each}
  </div>
</div>

{#if showModal}
  <div class="modal-backdrop" tabindex="0" role="dialog" aria-modal="true" on:click|self={closeModal}>
    <div class="modal-content">
      <button class="close-btn" on:click={closeModal} aria-label="Fermer">×</button>
      <h3>{modalTitle}</h3>
      <ul>
        {#each modalData as item}
          <li>{item.label} : {item.value.toLocaleString('fr-FR')} €</li>
        {/each}
      </ul>
    </div>
  </div>
{/if}

<style>
  .donut-container {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    max-width: 1000px;
    margin: 0 auto;
  }
  .chart-wrapper {
    position: relative;
    flex-shrink: 0;
  }
  .center-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;
  }
  .total-amount {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.25rem;
  }
  .total-label {
    font-size: 0.875rem;
    color: #666;
  }
  .legend {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .legend-item:hover {
    background-color: #f5f5f5;
  }
  .legend-color {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .legend-text {
    flex: 1;
    min-width: 0;
  }
  .legend-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.125rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .legend-value {
    font-size: 0.75rem;
    color: #666;
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    width: 440px;
    max-width: 90vw;
    max-height: 90vh;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }
  @media (max-width: 768px) {
    .donut-container {
      flex-direction: column;
      align-items: center;
    }
    .chart-wrapper {
      margin-bottom: 1rem;
    }
  }
</style> 