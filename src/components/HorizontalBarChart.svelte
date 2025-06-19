<script context="module" lang="ts">
  export interface BarItem {
    label: string;
    compte: string;
    prevus_2024: number;
    realises_2024: number;
    propositions_2025: number;
    color: string;
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let data: BarItem[] = [];
  export let type: 'expenses' | 'revenues';
  export let title: string = '';

  let chartId = `bar-${type}-${Math.random().toString(36).substr(2, 9)}`;
  let chartInstance: any = null;

  const periodColors = {
    prevus_2024: '#90caf9', // bleu clair
    realises_2024: '#43a047', // vert
    propositions_2025: '#fbc02d' // jaune/orange
  };
  const periodLabels = {
    prevus_2024: 'Prévus 2024',
    realises_2024: 'Réalisés 2024',
    propositions_2025: 'Propositions 2025'
  };

  onMount(async () => {
    const Chart = (await import('chart.js/auto')).default;
    const labels = data.map(item => item.label);
    const prevus = data.map(item => item.prevus_2024);
    const realises = data.map(item => item.realises_2024);
    const proposes = data.map(item => item.propositions_2025);

    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: periodLabels.prevus_2024,
            data: prevus,
            backgroundColor: periodColors.prevus_2024,
            borderRadius: 6,
            maxBarThickness: 24
          },
          {
            label: periodLabels.realises_2024,
            data: realises,
            backgroundColor: periodColors.realises_2024,
            borderRadius: 6,
            maxBarThickness: 24
          },
          {
            label: periodLabels.propositions_2025,
            data: proposes,
            backgroundColor: periodColors.propositions_2025,
            borderRadius: 6,
            maxBarThickness: 24
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
              callback: function(value: number) {
                return value.toLocaleString('fr-FR') + ' €';
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
  });

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  });
</script>

<div class="bar-chart-container">
  {#if title}
    <h3 class="bar-chart-title">{title}</h3>
  {/if}
  <canvas id={chartId} height={Math.max(300, data.length * 40)}></canvas>
</div>

<style>
.bar-chart-container {
  width: 100%;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.07);
  padding: 2rem 2rem 1.5rem 2rem;
  margin-bottom: 2rem;
}
.bar-chart-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1976d2;
  text-align: center;
}
canvas {
  width: 100% !important;
  min-height: 300px;
  max-height: 900px;
  display: block;
}
</style> 