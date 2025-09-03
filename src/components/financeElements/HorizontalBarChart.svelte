<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { ChartDataItem } from '../../types';


  // Props avec $props - CORRECTION: ne pas destructurer pour garder la réactivité
  const props = $props<{
    data?: ChartDataItem[];
    chartId?: string;
  }>();

  // Variables dérivées réactives
  const data = $derived(props.data || []);
  const chartId = $derived(props.chartId || 'bar-fonctionnement');

  // État local avec $state
  let chartInstance = $state<any>(null);
  let canvasElement: HTMLCanvasElement | null = null;

  // Configuration des périodes
  const periodConfig = {
    prevus_2024: { color: '#90caf9', label: 'Prévus 2024' },
    realises_2024: { color: '#43a047', label: 'Réalisés 2024' },
    propositions_2025: { color: '#fbc02d', label: 'Propositions 2025' }
  } as const;

  // Fonction utilitaire pour créer un dataset
  function createDataset(period: keyof typeof periodConfig, data: ChartDataItem[]) {
    return {
      label: periodConfig[period].label,
      data: data.map((item: ChartDataItem) => item[period]),
      backgroundColor: periodConfig[period].color,
      borderRadius: 6,
      maxBarThickness: 16
    };
  }

  // Fonction de rendu du graphique
  async function renderChart(currentData: ChartDataItem[]) {
    const Chart = (await import('chart.js/auto')).default;
    if (chartInstance) {
      chartInstance.destroy();
    }
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: currentData.map((item: ChartDataItem) => item.label),
        datasets: [
          createDataset('prevus_2024', currentData),
          createDataset('realises_2024', currentData),
          createDataset('propositions_2025', currentData)
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 14, weight: 'bold' }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const value = context.parsed.x;
                return `${context.dataset.label}: ${value.toLocaleString('fr-FR')} €`;
              }
            }
          },
          title: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: function(value: string | number): string {
                const n = typeof value === 'string' ? parseFloat(value) : value;
                return n.toLocaleString('fr-FR') + ' €';
              },
              font: { size: 13 }
            },
            grid: { color: '#e0e0e0' }
          },
          y: {
            ticks: {
              font: { size: 13, weight: 'bold' },
              color: '#333'
            },
            grid: { display: false }
          }
        },
        animation: {
          duration: 900,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  // Effet principal : (ré)affiche le graphique à chaque changement de props
  $effect(() => {
    renderChart(data);
  });

  // Effet pour écouter l'événement updateChart
  $effect(() => {
    function handleUpdateChart(event: CustomEvent<{ data: ChartDataItem[]; chartId?: string }>) {
      const { data: newData, chartId: targetChartId } = event.detail;
      if (targetChartId && targetChartId !== chartId) {
        return;
      }
      renderChart(newData);
    }
    
    document.addEventListener('updateChart', handleUpdateChart as EventListener);
    
    return () => {  
      document.removeEventListener('updateChart', handleUpdateChart as EventListener);
    };
  });

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  });
</script>

<div class="bar-chart-container chart-wrapper">
  <canvas bind:this={canvasElement} id={chartId} height={Math.max(300, data.length * 40)}></canvas>
</div>

<style>
.bar-chart-container.chart-wrapper {
  width: 100%;
  border-radius: 1rem;
  padding: 1.1rem 1rem 1rem 1rem;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
canvas {
  width: 100% !important;
  min-height: 180px;
  max-height: 600px;
  display: block;
}
</style> 