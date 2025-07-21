<!--
  =============================================================================
  COMPOSANT: DONUT CHART - GRAPHIQUE EN DONUT AVEC CHART.JS
  =============================================================================
  
  Affiche un graphique en donut avec Chart.js
  Fonctionnalités :
  - Graphique donut avec Chart.js
  - Légende personnalisée avec couleurs et valeurs
  - Animations et interactions
  - Formatage des montants en euros
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import type { AggregatedData } from '../utils/budget-data';
  import { formatCurrency, generateColors, calculateTotal } from '../utils/budget-data';

  // Enregistrer tous les composants Chart.js
  Chart.register(...registerables);

  export let data: AggregatedData[] = [];
  export let title = '';

  let canvasElement: HTMLCanvasElement;
  let chart: Chart | null = null;

  $: total = calculateTotal(data);
  $: colors = generateColors(data.length);

  // Debug logs pour les props
  $: {
    console.log('📊 DonutChart - Props reçues:', { 
      dataLength: data?.length, 
      title, 
      total,
      data 
    });
  }

  // Réactif : mise à jour du graphique quand les données changent
  $: if (chart && data.length > 0) {
    console.log('🔄 DonutChart - Mise à jour du graphique');
    updateChart();
  }

  function createChart() {
    console.log('🎨 DonutChart - createChart appelée:', { 
      hasCanvas: !!canvasElement, 
      dataLength: data.length 
    });
    
    if (!canvasElement || data.length === 0) {
      console.log('❌ DonutChart - Création annulée:', { 
        hasCanvas: !!canvasElement, 
        dataLength: data.length 
      });
      return;
    }

    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
      console.log('❌ DonutChart - Pas de contexte 2D');
      return;
    }

    console.log('🎯 DonutChart - Création du chart avec:', {
      labels: data.map(item => item.label),
      values: data.map(item => item.value),
      colors: colors
    });

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(item => item.label),
        datasets: [{
          data: data.map(item => item.value),
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        cutout: '60%',
        layout: {
          padding: 20
        },
        plugins: {
          legend: {
            display: false // On utilise notre légende personnalisée
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${formatCurrency(value)} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeOutQuart'
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  function updateChart() {
    if (!chart) return;

    chart.data.labels = data.map(item => item.label);
    chart.data.datasets[0].data = data.map(item => item.value);
    chart.data.datasets[0].backgroundColor = colors;
    chart.update('active');
  }

  function handleLegendHover(index: number) {
    if (!chart) return;
    
    // Mettre en surbrillance le segment correspondant
    chart.setActiveElements([{
      datasetIndex: 0,
      index: index
    }]);
    chart.update('active');
  }

  function handleLegendLeave() {
    if (!chart) return;
    
    // Retirer la surbrillance
    chart.setActiveElements([]);
    chart.update('active');
  }

  onMount(() => {
    console.log('🎬 DonutChart - Component mounted');
    createChart();

    // Écouter les événements de mise à jour depuis la page
    const handleUpdateChart = (event: CustomEvent) => {
      console.log('📡 DonutChart - Événement updateChart reçu:', event.detail);
      
      const { data: newData, title: newTitle } = event.detail;
      
      // Mettre à jour les props
      data = newData || [];
      title = newTitle || title;
      
      console.log('🔄 DonutChart - Props mises à jour:', { dataLength: data.length, title });
    };

    // Écouter l'événement personnalisé
    document.addEventListener('updateChart', handleUpdateChart as EventListener);

    // Cleanup dans onDestroy
    return () => {
      document.removeEventListener('updateChart', handleUpdateChart as EventListener);
    };
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  });
</script>

<div class="donut-chart">
  {#if title}
    <h3 class="chart-title">{title}</h3>
  {/if}

  <div class="chart-container">
    <!-- Graphique Chart.js -->
    <div class="chart-canvas-container">
      <canvas 
        bind:this={canvasElement}
        class="chart-canvas"
        role="img"
        aria-label="Graphique en donut : {title}"
      ></canvas>
      
      <!-- Total au centre (overlay) -->
      <div class="center-overlay">
        <div class="center-total-amount">{formatCurrency(total)}</div>
        <div class="center-total-label">{title}</div>
      </div>
    </div>

    <!-- Légende personnalisée -->
    <div class="chart-legend">
      {#each data as item, index}
        <div 
          class="legend-item"
          on:mouseenter={() => handleLegendHover(index)}
          on:mouseleave={handleLegendLeave}
          role="button"
          tabindex="0"
        >
          <div 
            class="legend-color" 
            style="background-color: {colors[index]}"
          ></div>
          <div class="legend-content">
            <div class="legend-label">{item.label}</div>
            <div class="legend-value">
              <span class="legend-amount">{formatCurrency(item.value)}</span>
              <span class="legend-percentage">({((item.value / total) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .donut-chart {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .chart-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--secondary);
    text-align: center;
    margin-bottom: 2rem;
  }

  .chart-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
  }

  .chart-canvas-container {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .chart-canvas {
    width: 100%;
    height: auto;
    max-width: 400px;
  }

  .center-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;
    z-index: 10;
  }

  .center-total-amount {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--secondary);
    font-family: var(--font-main);
    margin-bottom: 0.25rem;
  }

  .center-total-label {
    font-size: 0.9rem;
    color: #6b7280;
    font-family: var(--font-main);
  }

  .chart-legend {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 0.5rem;
    scrollbar-width: thin;
    scrollbar-color: #d1d5db #f9fafb;
  }

  .chart-legend::-webkit-scrollbar {
    width: 6px;
  }

  .chart-legend::-webkit-scrollbar-track {
    background: #f9fafb;
    border-radius: 3px;
  }

  .chart-legend::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  .chart-legend::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .legend-item:hover,
  .legend-item.hovered {
    background-color: #f9fafb;
    transform: translateX(4px);
  }

  .legend-color {
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .legend-content {
    flex: 1;
    min-width: 0;
  }

  .legend-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--secondary);
    margin-bottom: 0.125rem;
    text-transform: capitalize;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .legend-value {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .legend-amount {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--primary);
    white-space: nowrap;
  }

  .legend-percentage {
    font-size: 0.8rem;
    color: #6b7280;
    white-space: nowrap;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .chart-container {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .chart-title {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .center-total-amount {
      font-size: 1.4rem;
    }

    .center-total-label {
      font-size: 0.8rem;
    }

    .chart-legend {
      max-height: 300px;
      gap: 0.25rem;
    }

    .legend-item {
      padding: 0.375rem;
      gap: 0.375rem;
    }

    .legend-color {
      width: 0.75rem;
      height: 0.75rem;
    }

    .legend-label {
      font-size: 0.8rem;
    }

    .legend-amount {
      font-size: 0.85rem;
    }

    .legend-percentage {
      font-size: 0.75rem;
    }

    .legend-value {
      gap: 0.25rem;
    }
  }
</style> 