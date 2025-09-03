import type { DrillDownItem, DetailItem } from '../types';

export function generateDrillDownData(
  overviewCategories: string[],
  detailExpenses: DetailItem[],
  detailIncomes: DetailItem[] | null,
  categoryMapping: Record<string, string>
): Record<string, DrillDownItem[]> {
  const drillDownData: Record<string, DrillDownItem[]> = {};

  overviewCategories.forEach((overviewCategory) => {
    const detailCategory = categoryMapping[overviewCategory];
    const expensesForCategory = detailExpenses.filter(
      (item: DetailItem) => item.category === detailCategory
    );
    const incomesForCategory = detailIncomes
      ? detailIncomes.filter((item: DetailItem) => item.category === detailCategory)
      : [];

    if (expensesForCategory.length > 0) {
      drillDownData[overviewCategory] = expensesForCategory.map((item: DetailItem) => ({
        compte: item.compte,
        libelle: item.libelle,
        prevus_2024: item.montant_prevu || 0,
        realises_2024: item.montant_realise || 0,
        propositions_2025: item.montant_propose || 0,
        type: 'expense',
      }));
    } else if (incomesForCategory.length > 0) {
      drillDownData[overviewCategory] = incomesForCategory.map((item: DetailItem) => ({
        compte: item.compte,
        libelle: item.libelle,
        prevus_2024: item.montant_prevu || 0,
        realises_2024: item.montant_realise || 0,
        propositions_2025: item.montant_propose || 0,
        type: 'income',
      }));
    }
  });

  return drillDownData;
}
