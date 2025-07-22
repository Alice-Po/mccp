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
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import type { AggregatedData } from '../utils/budget-data';
  import { formatCurrency, generateColors, calculateTotal } from '../utils/budget-data';

  // Enregistrer tous les composants Chart.js
  Chart.register(...registerables);

  const dispatch = createEventDispatcher();

  export let data: AggregatedData[] = [];
  export let title = '';
  export let chartId = 'default';
  export let enableDrillDown = false; // Nouveau prop pour activer/désactiver le drill-down

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
        maintainAspectRatio: false,
        cutout: '60%',
        layout: {
          padding: 10
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
        },
        onClick: enableDrillDown ? handleChartClick : undefined
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

  function handleChartClick(event: any, elements: any[]) {
    if (!enableDrillDown || elements.length === 0) return;
    
    const elementIndex = elements[0].index;
    const clickedData = data[elementIndex];
    
    console.log('🖱️ DonutChart - Clic sur segment:', {
      elementIndex,
      clickedData,
      enableDrillDown
    });

    // Dispatcher l'événement Svelte (pour les composants parents)
    dispatch('segmentClick', {
      category: clickedData.label,
      value: clickedData.value,
      index: elementIndex
    });

    // Dispatcher aussi un événement DOM global (pour les pages Astro)
    if (typeof document !== 'undefined') {
      const customEvent = new CustomEvent('segmentClick', {
        detail: {
          category: clickedData.label,
          value: clickedData.value,
          index: elementIndex
        }
      });
      document.dispatchEvent(customEvent);
      console.log('📡 DonutChart - Événement DOM dispatché:', customEvent.detail);
    }
  }

  onMount(() => {
    console.log('🎬 DonutChart - Component mounted');
    createChart();

    // Écouter les événements de mise à jour depuis la page
    const handleUpdateChart = (event: CustomEvent) => {
      console.log('📡 DonutChart - Événement updateChart reçu:', event.detail);
      
      const { data: newData, title: newTitle, chartId: targetChartId } = event.detail;
      
      // Vérifier si cet événement est destiné à ce composant
      if (targetChartId && targetChartId !== chartId) {
        console.log('⏭️ DonutChart - Événement ignoré (chartId différent):', { targetChartId, chartId });
        return;
      }
      
      // Mettre à jour les props
      data = newData || [];
      title = newTitle || title;
      
      console.log('🔄 DonutChart - Props mises à jour:', { dataLength: data.length, title, chartId });
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
          title={item.label}
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
    max-width: 1200px;
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
    display: flex;
    gap: 3rem;
    align-items: flex-start;
    max-width: 1200px;
    margin: 0 auto;
  }

  .chart-canvas-container {
    position: relative;
    flex-shrink: 0;
    width: 400px;
    height: 400px;
  }

  .chart-canvas {
    width: 100%;
    height: 100%;
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
    font-size: 1.5rem;
    font-weight: bold;
    color: #1B365D;
    font-family: var(--font-main);
    margin-bottom: 0.25rem;
  }

  .center-total-label {
    font-size: 0.875rem;
    color: #666;
    font-family: var(--font-main);
  }

  .chart-legend {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 400px;
    overflow-y: auto;
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
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
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

  .legend-content {
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .legend-label {
    font-size: 0.95rem;
    font-weight: 500;
    color: #333;
    text-transform: capitalize;
    line-height: 1.2;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .legend-value {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
    margin-left: 1rem;
  }

  .legend-amount {
    font-size: 1.05rem;
    font-weight: bold;
    color: #1B365D;
    white-space: nowrap;
  }

  .legend-percentage {
    font-size: 0.85rem;
    color: #666;
    white-space: nowrap;
    margin-left: 0.25rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .chart-container {
      flex-direction: column;
      align-items: center;
    }

    .chart-canvas-container {
      width: 350px;
      height: 350px;
      margin-bottom: 1rem;
    }

    .chart-title {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .center-total-amount {
      font-size: 1.3rem;
    }

    .center-total-label {
      font-size: 0.8rem;
    }

    .chart-legend {
      width: 100%;
      max-height: 300px;
      gap: 0.4rem;
    }

    .legend-item {
      padding: 0.4rem;
      gap: 0.6rem;
    }

    .legend-color {
      width: 0.9rem;
      height: 0.9rem;
    }

    .legend-label {
      font-size: 0.9rem;
    }

    .legend-amount {
      font-size: 1rem;
    }

    .legend-percentage {
      font-size: 0.8rem;
    }

    .legend-value {
      margin-left: 0.5rem;
    }
  }
</style> 