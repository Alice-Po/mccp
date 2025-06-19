<script context="module" lang="ts">
  export interface DonutItem {
    label: string;
    compte: string;
    prevus_2024: number;
    realises_2024: number;
    propositions_2025: number;
    color: string;
  }
</script>

<script lang="ts">
  import Donut from './Donut.svelte';
  import HorizontalBarChart from './HorizontalBarChart.svelte';

  export let data: DonutItem[] = [];
  export let type: 'expenses' | 'revenues';
  export let drillDownData: Record<string, any[]> = {};

  const periods = [
    { key: 'prevus_2024', label: 'Prévus pour 2024' },
    { key: 'realises_2024', label: 'Réalisés en 2024' },
    { key: 'propositions_2025', label: 'Propositions pour 2025' },
    { key: 'comparaison', label: 'Comparaison' }
  ];
  const defaultPeriod = 'propositions_2025';

  let currentPeriod: string = defaultPeriod;

  function setPeriod(period: string) {
    if (period !== currentPeriod) {
      currentPeriod = period;
    }
  }
</script>

<div class="budget-tabs-container">
  <div class="donut-period-toggle">
    {#each periods as p}
      <button
        type="button"
        class="toggle-btn"
        data-period={p.key}
        aria-current={p.key === currentPeriod ? 'true' : 'false'}
        on:click={() => setPeriod(p.key)}
      >
        {p.label}
      </button>
    {/each}
  </div>

  <div class="chart-wrapper">
    {#if currentPeriod === 'comparaison'}
      <HorizontalBarChart
        data={data}
        type={type}
        title={`${type === 'expenses' ? 'Dépenses' : 'Recettes'} - Comparaison des périodes`}
      />
    {:else}
      <Donut
        data={data}
        type={type}
        drillDownData={drillDownData}
        activePeriod={currentPeriod}
        periods={periods.filter(p => p.key !== 'comparaison')}
      />
    {/if}
  </div>
</div>

<style>
  .budget-tabs-container {
    width: 100%;
  }

  .donut-period-toggle {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .toggle-btn {
    background: none;
    border: none;
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    border-bottom: 2.5px solid transparent;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    border-radius: 0.25rem 0.25rem 0 0;
  }

  .toggle-btn[aria-current="true"] {
    color: #1976d2;
    border-bottom: 2.5px solid #1976d2;
    background: #f5faff;
  }

  .toggle-btn:focus {
    outline: 2px solid #1976d2;
  }

  .chart-wrapper {
    width: 100%;
  }
</style> 