// Types partagés pour les finances

export interface BudgetItem {
  SECTION: string;
  'DÉPENSES/RECETTES': string;
  regroupement_focale_n1: string;
  REALISATIONS_2024: number;
  // Ajoutez d'autres propriétés selon vos besoins
}

export interface FiscaliteItem {
  type_taxe: string;
  taux_vote_commune_putanges: string;
  taux_moyen_communes_francaises_comparables: string;
  commentaire: string;
}

export interface IndicateurFinancier {
  critere: string;
  definition_critere: string;
  valeur_putanges_le_lac_par_habitant: string;
  mediane_echantillon_par_habitant: string;
  classement_putanges_le_lac_sur_129: string;
  premier_decile_par_habitant: string;
  dernier_decile_par_habitant: string;
  commentaires: string;
}

// Types pour les composants de graphiques
export interface DonutChartProps {
  data: AggregatedData[];
  title: string;
  chartId: string;
  enableDrillDown?: boolean;
  onsegmentclick: (detail: { category: string; value: number; index: number }) => void;
}

// Types pour les modales
export interface DrillDownModalProps {
  isOpen: boolean;
  budgetData: BudgetItem[];
  modalData: {
    category: string;
    section: string;
    type: string;
  } | null;
  onclose: () => void;
}

// Import du type AggregatedData depuis budget-data
import type { AggregatedData } from './utils/budget-data';
