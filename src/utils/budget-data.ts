/**
 * Utilitaire pour traiter les données de budget
 * Agrégation par section, type et regroupement
 */

export interface BudgetItem {
  'DÉPENSES/RECETTES': 'DEPENSES' | 'RECETTES';
  SECTION: 'FONCTIONNEMENT' | 'INVESTISSEMENT';
  COMPTE: string;
  LIBELLE: string;
  regroupement_focale_n1: string;
  regroupement_focale_n2: string;
  pour_comparaison_prévision_réalisation: boolean;
  CHAPITRE_officiel: string;
  PREVISIONS_2024: number;
  REALISATIONS_2024: number;
  PROPOSITIONS_2025: number;
  TAUX_EXECUTION_2024: number;
  EVOLUTION_2024_2025_ABSOLUE: number;
  EVOLUTION_2024_2025_RELATIVE: number;
}

export interface AggregatedData {
  label: string;
  value: number;
  items: BudgetItem[];
}

/**
 * Agrège les données par section, type et regroupement
 * @param data - Données JSON brutes
 * @param section - "FONCTIONNEMENT" ou "INVESTISSEMENT"
 * @param type - "DEPENSES" ou "RECETTES"
 * @param groupBy - "regroupement_focale_n1" ou "regroupement_focale_n2"
 * @returns Données agrégées avec totaux par regroupement
 */
export function aggregateData(
  data: BudgetItem[],
  section: 'FONCTIONNEMENT' | 'INVESTISSEMENT',
  type: 'DEPENSES' | 'RECETTES',
  groupBy: 'regroupement_focale_n1' | 'regroupement_focale_n2' = 'regroupement_focale_n1'
): AggregatedData[] {
  console.log('🔧 aggregateData - Début agrégation:', {
    dataLength: data?.length,
    section,
    type,
    groupBy,
  });

  // Filtrer les données selon les critères
  const filteredData = data.filter(
    (item) => item.SECTION === section && item['DÉPENSES/RECETTES'] === type
  );

  console.log('📊 aggregateData - Données filtrées:', filteredData?.length, 'éléments');
  console.log('📊 aggregateData - Exemple données filtrées:', filteredData?.[0]);

  // Grouper par regroupement
  const grouped = new Map<string, BudgetItem[]>();

  filteredData.forEach((item) => {
    const key = item[groupBy];
    console.log('🔑 aggregateData - Clé de regroupement:', key, 'pour item:', item.LIBELLE);
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item);
  });

  console.log('📊 aggregateData - Groupes créés:', grouped.size);
  grouped.forEach((items, label) => {
    console.log(`📊 aggregateData - Groupe "${label}":`, items.length, 'éléments');
  });

  // Calculer les totaux pour chaque groupe
  const result: AggregatedData[] = [];

  grouped.forEach((items, label) => {
    const total = items.reduce((sum, item) => sum + item.REALISATIONS_2024, 0);
    console.log(`💰 aggregateData - Groupe "${label}": total = ${total} (REALISATIONS_2024)`);

    // Ignorer les groupes avec un total de 0
    if (total > 0) {
      result.push({
        label,
        value: total,
        items,
      });
    }
  });

  console.log('📊 aggregateData - Résultat final:', result.length, 'groupes avec valeurs > 0');
  console.log('📊 aggregateData - Détail résultat:', result);

  // Trier par valeur décroissante
  return result.sort((a, b) => b.value - a.value);
}

/**
 * Agrège les données par regroupement_focale_n2 pour une catégorie regroupement_focale_n1 donnée
 * Utilisé pour le drill-down dans les graphiques
 */
export function aggregateDataLevel2(
  data: BudgetItem[],
  section: string,
  type: string,
  valueField: keyof BudgetItem,
  selectedN1Category: string
): AggregatedData[] {
  console.log('📊 aggregateDataLevel2 - Paramètres:', {
    dataLength: data.length,
    section,
    type,
    valueField,
    selectedN1Category,
  });

  // Filtrer par section, type et catégorie N1
  const filteredData = data.filter((item) => {
    const matchesSection = item.SECTION?.toUpperCase() === section.toUpperCase();
    const matchesType = item['DÉPENSES/RECETTES']?.toUpperCase() === type.toUpperCase();
    const matchesN1 = item.regroupement_focale_n1 === selectedN1Category;

    return matchesSection && matchesType && matchesN1;
  });

  console.log('🔍 aggregateDataLevel2 - Données filtrées:', {
    originalLength: data.length,
    filteredLength: filteredData.length,
    selectedN1Category,
  });

  // Grouper par regroupement_focale_n2
  const groupedData = filteredData.reduce((acc, item) => {
    const key = item.regroupement_focale_n2 || 'Non classé';
    const value = Number(item[valueField]) || 0;

    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += value;

    return acc;
  }, {} as Record<string, number>);

  console.log('📈 aggregateDataLevel2 - Données groupées:', groupedData);

  // Convertir en format AggregatedData et trier
  const result = Object.entries(groupedData)
    .map(([label, value]) => {
      // Récupérer les items pour cette catégorie
      const items = filteredData.filter(
        (item) => (item.regroupement_focale_n2 || 'Non classé') === label
      );

      return { label, value, items };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  console.log('✅ aggregateDataLevel2 - Résultat final:', result);

  return result;
}

/**
 * Calcule le total d'une liste de données agrégées
 */
export function calculateTotal(aggregatedData: AggregatedData[]): number {
  return aggregatedData.reduce((sum, item) => sum + item.value, 0);
}

/**
 * Formate un montant en euros
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Génère des couleurs pour le graphique donut
 */
export function generateColors(count: number): string[] {
  const baseColors = [
    '#F59E0B', // Jaune (CHARGES A CARACTERE GENERAL)
    '#EF4444', // Rouge (CHARGES DE PERSONNEL)
    '#10B981', // Vert (ATTENUATION DE PRODUITS)
    '#8B5CF6', // Violet (VIREMENT A LA SECTION D'INVESTISSEMENT)
    '#06B6D4', // Cyan (CHARGES FINANCIERES)
    '#3B82F6', // Bleu (CHARGES SPECIFIQUES)
    '#6366F1', // Indigo (DOTATIONS AUX AMORTISSEMENTS)
    '#EC4899', // Rose
  ];

  // Si on a besoin de plus de couleurs, on génère des variations
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  const colors: string[] = [...baseColors];
  const hueStep = 360 / count;

  for (let i = baseColors.length; i < count; i++) {
    const hue = (i * hueStep) % 360;
    colors.push(`hsl(${hue}, 65%, 55%)`);
  }

  return colors;
}

/**
 * Agrège les données par CHAPITRE_officiel pour une section et un type donnés
 * Retourne un tableau d'objets avec label, compte, prevus_2024, realises_2024, propositions_2025, color
 */
export interface BarItem {
  label: string;
  compte: string;
  prevus_2024: number;
  realises_2024: number;
  propositions_2025: number;
  color: string;
}

export function aggregateByChapitre(
  data: BudgetItem[],
  section: 'FONCTIONNEMENT' | 'INVESTISSEMENT',
  type: 'DEPENSES' | 'RECETTES'
): BarItem[] {
  // Filtrer les données selon les critères
  const filteredData = data.filter(
    (item) => item.SECTION === section && item['DÉPENSES/RECETTES'] === type
  );

  // Grouper par CHAPITRE_officiel
  const grouped = new Map<string, BudgetItem[]>();
  filteredData.forEach((item) => {
    const key = item.CHAPITRE_officiel;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item);
  });

  // Palette de couleurs (réutilise les couleurs du donut)
  const palette = [
    '#1976d2',
    '#43a047',
    '#fbc02d',
    '#ac502b',
    '#1b365d',
    '#90caf9',
    '#e57373',
    '#8d6e63',
    '#388e3c',
    '#ffb300',
  ];

  // Construire le résultat
  let colorIndex = 0;
  const result: BarItem[] = [];
  grouped.forEach((items, label) => {
    const prevus_2024 = items.reduce((sum, item) => sum + (item.PREVISIONS_2024 || 0), 0);
    const realises_2024 = items.reduce((sum, item) => sum + (item.REALISATIONS_2024 || 0), 0);
    const propositions_2025 = items.reduce((sum, item) => sum + (item.PROPOSITIONS_2025 || 0), 0);
    if (prevus_2024 > 0 || realises_2024 > 0 || propositions_2025 > 0) {
      result.push({
        label,
        compte: items[0].COMPTE,
        prevus_2024,
        realises_2024,
        propositions_2025,
        color: palette[colorIndex % palette.length],
      });
      colorIndex++;
    }
  });
  // Trier par montant réalisé décroissant
  return result.sort((a, b) => b.realises_2024 - a.realises_2024);
}
