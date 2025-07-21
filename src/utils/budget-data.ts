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
