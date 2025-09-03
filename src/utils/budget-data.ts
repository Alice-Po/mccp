/**
 * Utilitaire pour traiter les données de budget
 * Agrégation par section, type et regroupement
 */

import type { BudgetItem, AggregatedData, BarItem, OverviewData } from '../types';

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
  // Filtrer les données selon les critères
  const filteredData = data.filter(
    (item) => item.SECTION === section && item['DÉPENSES/RECETTES'] === type
  );

  // Grouper par regroupement
  const grouped = new Map<string, BudgetItem[]>();

  filteredData.forEach((item) => {
    const key = item[groupBy];
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item);
  });

  // Calculer les totaux pour chaque groupe
  const result: AggregatedData[] = [];

  grouped.forEach((items, label) => {
    const total = items.reduce((sum, item) => sum + item.REALISATIONS_2024, 0);

    // Ignorer les groupes avec un total de 0
    if (total > 0) {
      result.push({
        label,
        value: total,
        items,
      });
    }
  });

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
  // Filtrer par section, type et catégorie N1
  const filteredData = data.filter((item) => {
    const matchesSection = item.SECTION?.toUpperCase() === section.toUpperCase();
    const matchesType = item['DÉPENSES/RECETTES']?.toUpperCase() === type.toUpperCase();
    const matchesN1 = item.regroupement_focale_n1 === selectedN1Category;

    return matchesSection && matchesType && matchesN1;
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
 * Agrège les données par CHAPITRE_officiel pour le composant HorizontalBarChart
 * Applique des exclusions spécifiques pour la vulgarisation des données
 * @param data - Données JSON brutes
 * @param section - "FONCTIONNEMENT" ou "INVESTISSEMENT"
 * @param type - "DEPENSES" ou "RECETTES"
 * @returns Données agrégées avec exclusions appliquées pour HorizontalBarChart
 */
export function aggregateByChapitreForHorizontalBarChart(
  data: BudgetItem[],
  section: 'FONCTIONNEMENT' | 'INVESTISSEMENT',
  type: 'DEPENSES' | 'RECETTES'
): BarItem[] {
  // Filtrer les données selon les critères
  let filteredData = data.filter(
    (item) => item.SECTION === section && item['DÉPENSES/RECETTES'] === type
  );

  // Exclusions spécifiques pour la vulgarisation dans HorizontalBarChart
  const vulgarizationExclusions: Record<string, Record<string, string[]>> = {
    FONCTIONNEMENT: {
      DEPENSES: [
        "VIREMENT A LA SECTION D'INVESTISSEMENT", // Masqué car confus pour la vulgarisation
      ],
    },
    // Facilement extensible pour d'autres exclusions
  };

  // Appliquer les exclusions si elles existent
  const exclusions = vulgarizationExclusions[section]?.[type];
  if (exclusions && exclusions.length > 0) {
    filteredData = filteredData.filter((item) => !exclusions.includes(item.CHAPITRE_officiel));
  }

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

// Type pour la table financière détaillée

// Mapping des libellés de chapitres vers leur numéro
export const CHAPITRE_NUMBERS_MAP: Record<string, string> = {
  // Fonctionnement
  'CHARGES A CARACTERE GENERAL': '011',
  'CHARGES DE PERSONNEL': '012',
  'ATTENUATION DE PRODUITS': '014',
  'AUTRES CHARGES DE GESTION COURANTE': '65',
  'CHARGES FINANCIERES': '66',
  'CHARGES SPECIFIQUES': '67',
  'DOTATIONS AUX AMORTISSEMENTS ET PROVIS.': '68',
  "VIREMENT A LA SECTION D'INVESTISSEMENT": '023',
  'CHARGES EXCEPTIONNELLES': '678',
  "OPER. D'ORDRE DE TRANSFERT ENTRE SECTIONS": '042',
  // Recettes fonctionnement
  'PRODUITS DES SERVICES ET DU DOMAINE': '70',
  'IMPOTS ET TAXES': '73',
  'FISCALITE LOCALE': '731',
  'DOTATIONS ET PARTICIPATIONS': '74',
  'AUTRES PROD. DE GESTION COURANTE': '75',
  'ATTENUATION DE CHARGES': '78',
  'PRODUITS FINANCIERS': '76',
  'PRODUITS EXCEPTIONNELS': '77',
  'EXCEDENT REPORTE': '002',
  // Investissement
  'IMMOBILISATIONS INCORPORELLES': '20',
  'IMMOBILISATIONS CORPORELLES': '21',
  'IMMOBILISATIONS EN COURS': '23',
  'AUTRES IMMOBILISATIONS FINANCIERES': '27',
  "SUBVENTIONS D'EQUIPEMENT": '13',
  'APPORTS DOTATIONS ET RESERVES': '10',
  'PRODUITS DES CESSIONS': '024',
  "REMBOURSEMENT D'EMPRUNTS ET DETTES": '16',
  'EMPRUNTS ET DETTES ASSIMILEES': '165',
  "DEFICIT D'INVESTISSEMENT REPORTE": '001',
  'EXCEDENT ANTERIEUR REPORTE': '001',
  'OPERATIONS PATRIMONIALES': '040',
  "SUBVENTIONS D'EQUIPEMENT VERSEES": '204',
  'VIREMENT DE LA SECTION DE FONCTIONNEMENT': '021',
};

/**
 * Transforme un tableau plat de BudgetItem en structure OverviewData pour FinancialTable.svelte
 * Chaque section = un chapitre, chaque item = total du chapitre (pas les articles détaillés)
 * @param items BudgetItem[]
 * @param title string
 * @returns OverviewData
 */
export function buildOverviewDataByChapitre(
  items: BudgetItem[],
  title: string = 'Tableau financier par chapitre'
): OverviewData {
  // Regrouper par CHAPITRE_officiel
  const grouped = new Map<string, BudgetItem[]>();
  items.forEach((item) => {
    const key = item.CHAPITRE_officiel || 'Non classé';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  });

  // Générer les sections (un chapitre = une section)
  const sections = Array.from(grouped.entries()).map(([chapitre, chapitreItems]) => {
    const sectionType = chapitreItems[0]?.regroupement_focale_n1 || 'Autre';
    const sectionTitle = chapitre;
    // Un seul item par section : le total du chapitre
    const totalItem = {
      compte: CHAPITRE_NUMBERS_MAP[chapitre.toUpperCase()] || '', // mapping strict, pas de fallback
      libelle: chapitre, // le nom du chapitre
      prevus_2024: chapitreItems.reduce((sum, i) => sum + (i.PREVISIONS_2024 || 0), 0),
      realises_2024: chapitreItems.reduce((sum, i) => sum + (i.REALISATIONS_2024 || 0), 0),
      propositions_2025: chapitreItems.reduce((sum, i) => sum + (i.PROPOSITIONS_2025 || 0), 0),
      notes: '',
    };
    return {
      type: sectionType,
      title: sectionTitle,
      items: [totalItem],
      total: {
        libelle: 'Total ' + chapitre,
        prevus_2024: totalItem.prevus_2024,
        realises_2024: totalItem.realises_2024,
        propositions_2025: totalItem.propositions_2025,
      },
    };
  });

  // Métadonnées génériques
  const metadata = {
    title,
    periods: {
      budget_2024: 'Prévus 2024',
      actual_2024: 'Réalisés 2024',
      budget_2025: 'Propositions 2025',
    },
    columns: {
      compte: 'Compte',
      libelle: 'Chapitre',
      prevus_2024: 'Prévus 2024',
      realises_2024: 'Réalisés 2024',
      propositions_2025: 'Propositions 2025',
      notes: 'Notes',
    },
  };

  return { metadata, sections };
}
