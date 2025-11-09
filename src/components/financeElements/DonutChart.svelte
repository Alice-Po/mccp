<!--
  =============================================================================
  COMPOSANT: DONUT CHART - GRAPHIQUE EN DONUT AVEC CHART.JS (SVELTE 5)
  =============================================================================
  
  Affiche un graphique en donut avec Chart.js
  Fonctionnalités :
  - Graphique donut avec Chart.js
  - Légende personnalisée avec couleurs et valeurs
  - Animations et interactions
  - Formatage des montants en euros
  ⚡ Refactorisé proprement pour Svelte 5
-->

<script lang="ts">
  import { Chart, registerables } from 'chart.js';
  import type { AggregatedData, DonutChartProps } from '../../types';
  import { formatCurrency, generateColors, calculateTotal } from '../../utils/budget-data';

  // Enregistrer tous les composants Chart.js
  Chart.register(...registerables);

  // Props idiomatiques Svelte 5 - PAS de destructuration pour garder la réactivité
  const props = $props();
  // Valeurs dérivées réactives
  const data = $derived(props.data || []);
  const title = $derived(props.title || '');
  const chartId = $derived(props.chartId || 'default');
  const enableDrillDown = $derived(props.enableDrillDown ?? false);
  const onsegmentclick = $derived(props.onsegmentclick);

  // État local réactif
  let canvasElement = $state<HTMLCanvasElement>();
  let chart = $state<Chart | null>(null);

  // Valeurs calculées dérivées
  const total = $derived(calculateTotal(data));
  const colors = $derived(generateColors(data.length));

  // Fonction pour créer le graphique
  function createChart() {
    if (!canvasElement || data.length === 0) {
      return;
    }

    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
      console.log('❌ DonutChart - Pas de contexte 2D');
      return;
    }

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map((item: AggregatedData) => item.label),
        datasets: [{
          data: data.map((item: AggregatedData) => item.value),
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
        hover: {
          animationDuration: 200
        },
        interaction: {
          intersect: true,
          mode: 'nearest'
        },
        onClick: enableDrillDown ? handleChartClick : undefined
      }
    });
  }

 
  // Fonction pour mettre à jour le graphique
  function updateChart() {
    if (!chart) return;

    chart.data.labels = data.map((item: AggregatedData) => item.label);
    chart.data.datasets[0].data = data.map((item: AggregatedData) => item.value);
    chart.data.datasets[0].backgroundColor = colors;
    chart.update('active');
  }

  // Gestion du clic sur le graphique - ÉVÉNEMENT SVELTE 5 NATIF
  function handleChartClick(event: any, elements: any[]) {
    if (!enableDrillDown || elements.length === 0) return;
    
    const elementIndex = elements[0].index;
    const clickedData = data[elementIndex];

   // Vérifier si le drill-down est possible (moins de 2 éléments = pas de détail)
   if (!clickedData.items || clickedData.items.length < 2) {
      showNoDetailTooltip(elementIndex);
      return;
    }

    // Créer et appeler l'événement Svelte 5
    const customEvent = new CustomEvent('segmentclick', {
      detail: {
        category: clickedData.label,
        value: clickedData.value,
        index: elementIndex
      }
    });

    // Appeler le callback prop directement (syntaxe Svelte 5)
    onsegmentclick?.(customEvent);
  }

  // Gestion du hover sur la légende
  function handleLegendHover(index: number) {
    if (!chart) return;
    chart.setActiveElements([{
      datasetIndex: 0,
      index: index
    }]);
    chart.update('active');
  }

  function handleLegendLeave() {
    if (!chart) return;
    chart.setActiveElements([]);
    chart.update('active');
  }

  // Afficher tooltip "pas de détail"
  function showNoDetailTooltip(elementIndex: number) {
    const canvas = canvasElement;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const tooltip = document.createElement('div');
    tooltip.className = 'no-detail-tooltip';
    tooltip.textContent = 'Aucun détail supplémentaire disponible';
    tooltip.style.cssText = `
      position: fixed;
      top: ${rect.top + rect.height / 2}px;
      left: ${rect.left + rect.width / 2}px;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      z-index: 1000;
      pointer-events: none;
    `;
    
    document.body.appendChild(tooltip);
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    }, 2000);
  }

  // Effet pour la mise à jour du graphique quand les données changent
  $effect(() => {
    if (chart && data.length > 0) {
      updateChart();
    }
  });

  // Effet principal pour gérer le cycle de vie du chart
  $effect(() => {
    createChart();
    
    return () => {
      if (chart) {
        chart.destroy();
        chart = null;
      }
    };
  });
</script>
<div class="donut-chart">
  <div class="chart-container">
    <!-- Graphique Chart.js avec gestion des événements -->
    <div class="chart-canvas-container">
      <canvas 
        bind:this={canvasElement}
        class="chart-canvas"
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
          onmouseenter={() => handleLegendHover(index)}
          onmouseleave={handleLegendLeave}
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

  /* Responsive - Légende sous le graphique en dessous de 1024px */
  @media (max-width: 1024px) {
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

  .drill-down-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding: 0.85rem 1.5rem;
    background: #f0fdf4;
    border: 2px solid var(--primary, #2e8b57);
    border-radius: 1.2rem;
    box-shadow: 0 4px 16px rgba(46, 139, 87, 0.08);
    font-size: 1.08rem;
    color: var(--primary, #2e8b57);
    font-weight: 600;
    letter-spacing: 0.01em;
    text-align: center;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    transition: box-shadow 0.2s;
  }
  .drill-down-legend:hover {
    box-shadow: 0 8px 32px rgba(46, 139, 87, 0.13);
  }
  .legend-icon {
    font-size: 1.3rem;
    animation: gentle-pulse 2.2s ease-in-out infinite;
    filter: drop-shadow(0 1px 2px rgba(46,139,87,0.12));
  }
  @keyframes gentle-pulse {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.12); }
  }
  .legend-text {
    user-select: none;
    font-family: var(--font-main, 'Open Sans', Arial, sans-serif);
    font-size: 1.08rem;
    color: var(--primary, #2e8b57);
    font-weight: 600;
  }
</style>