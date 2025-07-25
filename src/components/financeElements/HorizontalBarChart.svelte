<script lang="ts">
  // Svelte 5 runes migration
  import { onDestroy } from 'svelte';

  // Props avec $props - CORRECTION: ne pas destructurer pour garder la réactivité
  const props = $props<{
    data?: any[];
    type?: string;
    title?: string;
    chartId?: string;
  }>();

  // Variables dérivées réactives avec $derived
  const data = $derived(props.data || []);
  const type = $derived(props.type || 'expenses');
  const title = $derived(props.title || '');
  const chartId = $derived(props.chartId || 'bar-fonctionnement');

  // État local avec $state
  let chartInstance = $state<any>(null);
  let canvasElement: HTMLCanvasElement | null = null;

  // Palette et labels
  const periodColors = {
    prevus_2024: '#90caf9',
    realises_2024: '#43a047',
    propositions_2025: '#fbc02d'
  };
  const periodLabels = {
    prevus_2024: 'Prévus 2024',
    realises_2024: 'Réalisés 2024',
    propositions_2025: 'Propositions 2025'
  };

  // Fonction de rendu du graphique
  async function renderChart(currentData: any[]) {
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
        labels: currentData.map((item: any) => item.label),
        datasets: [
          {
            label: periodLabels.prevus_2024,
            data: currentData.map((item: any) => item.prevus_2024),
            backgroundColor: periodColors.prevus_2024,
            borderRadius: 6,
            maxBarThickness: 16 // plus compact
          },
          {
            label: periodLabels.realises_2024,
            data: currentData.map((item: any) => item.realises_2024),
            backgroundColor: periodColors.realises_2024,
            borderRadius: 6,
            maxBarThickness: 16 // plus compact
          },
          {
            label: periodLabels.propositions_2025,
            data: currentData.map((item: any) => item.propositions_2025),
            backgroundColor: periodColors.propositions_2025,
            borderRadius: 6,
            maxBarThickness: 16 // plus compact
          }
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
              callback: function(value: string | number) {
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

  // Effet pour écouter l'événement updateChart (comme DonutChart)
  $effect(() => {
    function handleUpdateChart(event: CustomEvent) {
      
      const { data: newData, title: newTitle, chartId: targetChartId, type: newType } = event.detail;
      
      
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

<!-- Harmonisation du style avec la section donut -->
<style>
/* Section compacte pour le bar chart */
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