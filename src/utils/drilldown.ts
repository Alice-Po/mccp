export interface DrillDownItem {
  compte: string;
  libelle: string;
  prevus_2024: number;
  realises_2024: number;
  propositions_2025: number;
  type: 'expense' | 'income';
}

export function generateDrillDownData(
  overviewCategories: string[],
  detailExpenses: any[],
  detailIncomes: any[] | null,
  categoryMapping: Record<string, string>,
  typeExpense: 'expense' | 'investment_expense',
  typeIncome: 'income' | 'investment_income'
): Record<string, DrillDownItem[]> {
  const drillDownData: Record<string, DrillDownItem[]> = {};

  overviewCategories.forEach((overviewCategory) => {
    const detailCategory = categoryMapping[overviewCategory];
    const expensesForCategory = detailExpenses.filter(
      (item: any) => item.category === detailCategory
    );
    const incomesForCategory = detailIncomes
      ? detailIncomes.filter((item: any) => item.category === detailCategory)
      : [];

    if (expensesForCategory.length > 0) {
      drillDownData[overviewCategory] = expensesForCategory.map((item: any) => ({
        compte: item.compte,
        libelle: item.libelle,
        prevus_2024: item.montant_prevu || 0,
        realises_2024: item.montant_realise || 0,
        propositions_2025: item.montant_propose || 0,
        type: 'expense',
      }));
    } else if (incomesForCategory.length > 0) {
      drillDownData[overviewCategory] = incomesForCategory.map((item: any) => ({
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
