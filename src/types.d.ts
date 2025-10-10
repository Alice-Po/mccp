import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { HTMLAttributes, ImageMetadata } from 'astro/types';

export interface Post {
  /** A unique ID number that identifies a post. */
  id: string;

  /** A post’s unique slug – part of the post’s URL based on its name, i.e. a post called “My Sample Page” has a slug “my-sample-page”. */
  slug: string;

  /**  */
  permalink: string;

  /**  */
  publishDate: Date;
  /**  */
  updateDate?: Date;

  /**  */
  title: string;
  /** Optional summary of post content. */
  excerpt?: string;
  /**  */
  image?: ImageMetadata | string;

  /**  */
  category?: Taxonomy;
  /**  */
  tags?: Taxonomy[];
  /**  */
  author?: string;

  /**  */
  metadata?: MetaData;

  /**  */
  draft?: boolean;

  /**  */
  Content?: AstroComponentFactory;
  content?: string;

  /**  */
  readingTime?: number;
}

export interface Taxonomy {
  slug: string;
  title: string;
}

export interface MetaData {
  title?: string;
  ignoreTitleTemplate?: boolean;

  canonical?: string;

  robots?: MetaDataRobots;

  description?: string;

  openGraph?: MetaDataOpenGraph;
  twitter?: MetaDataTwitter;
}

export interface MetaDataRobots {
  index?: boolean;
  follow?: boolean;
}

export interface MetaDataImage {
  url: string;
  width?: number;
  height?: number;
}

export interface MetaDataOpenGraph {
  url?: string;
  siteName?: string;
  images?: Array<MetaDataImage>;
  locale?: string;
  type?: string;
}

export interface MetaDataTwitter {
  handle?: string;
  site?: string;
  cardType?: string;
}

export interface Image {
  src: string;
  alt?: string;
}

export interface Video {
  src: string;
  type?: string;
}

export interface Widget {
  id?: string;
  isDark?: boolean;
  bg?: string;
  classes?: Record<string, string | Record<string, string>>;
}

export interface Headline {
  title?: string;
  subtitle?: string;
  tagline?: string;
  classes?: Record<string, string>;
}

interface TeamMember {
  name?: string;
  job?: string;
  image?: Image;
  socials?: Array<Social>;
  description?: string;
  classes?: Record<string, string>;
}

interface Social {
  icon?: string;
  href?: string;
}

export interface Stat {
  amount?: number | string;
  title?: string;
  icon?: string;
}

export interface Item {
  title?: string;
  description?: string;
  icon?: string;
  classes?: Record<string, string>;
  callToAction?: CallToAction;
  image?: Image;
}

export interface Price {
  title?: string;
  subtitle?: string;
  description?: string;
  price?: number | string;
  period?: string;
  items?: Array<Item>;
  callToAction?: CallToAction;
  hasRibbon?: boolean;
  ribbonTitle?: string;
}

export interface Testimonial {
  title?: string;
  testimonial?: string;
  name?: string;
  job?: string;
  image?: string | unknown;
}

export interface Input {
  type: HTMLInputTypeAttribute;
  name: string;
  label?: string;
  autocomplete?: string;
  placeholder?: string;
}

export interface Textarea {
  label?: string;
  name?: string;
  placeholder?: string;
  rows?: number;
}

export interface Disclaimer {
  label?: string;
}

// COMPONENTS
export interface CallToAction extends Omit<HTMLAttributes<'a'>, 'slot'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  text?: string;
  icon?: string;
  classes?: Record<string, string>;
  type?: 'button' | 'submit' | 'reset';
}

export interface ItemGrid {
  items?: Array<Item>;
  columns?: number;
  defaultIcon?: string;
  classes?: Record<string, string>;
}

export interface Collapse {
  iconUp?: string;
  iconDown?: string;
  items?: Array<Item>;
  columns?: number;
  classes?: Record<string, string>;
}

export interface Form {
  inputs?: Array<Input>;
  textarea?: Textarea;
  disclaimer?: Disclaimer;
  button?: string;
  description?: string;
}

// WIDGETS
export interface Hero extends Omit<Headline, 'classes'>, Omit<Widget, 'isDark' | 'classes'> {
  content?: string;
  actions?: string | CallToAction[];
  image?: string | unknown;
}

export interface Team extends Omit<Headline, 'classes'>, Widget {
  team?: Array<TeamMember>;
}

export interface Stats extends Omit<Headline, 'classes'>, Widget {
  stats?: Array<Stat>;
}

export interface Pricing extends Omit<Headline, 'classes'>, Widget {
  prices?: Array<Price>;
}

export interface Testimonials extends Omit<Headline, 'classes'>, Widget {
  testimonials?: Array<Testimonial>;
  callToAction?: CallToAction;
}

export interface Brands extends Omit<Headline, 'classes'>, Widget {
  icons?: Array<string>;
  images?: Array<Image>;
}

export interface Features extends Omit<Headline, 'classes'>, Widget {
  image?: string | unknown;
  video?: Video;
  items?: Array<Item>;
  columns?: number;
  defaultIcon?: string;
  callToAction1?: CallToAction;
  callToAction2?: CallToAction;
  isReversed?: boolean;
  isBeforeContent?: boolean;
  isAfterContent?: boolean;
}

export interface Faqs extends Omit<Headline, 'classes'>, Widget {
  iconUp?: string;
  iconDown?: string;
  items?: Array<Item>;
  columns?: number;
}

export interface Steps extends Omit<Headline, 'classes'>, Widget {
  items: Array<{
    title: string;
    description?: string;
    icon?: string;
    classes?: Record<string, string>;
  }>;
  callToAction?: string | CallToAction;
  image?: string | Image;
  isReversed?: boolean;
}

export interface Content extends Omit<Headline, 'classes'>, Widget {
  content?: string;
  image?: string | unknown;
  items?: Array<Item>;
  columns?: number;
  isReversed?: boolean;
  isAfterContent?: boolean;
  callToAction?: CallToAction;
  conclusion?: string;
}

export interface Contact extends Omit<Headline, 'classes'>, Form, Widget {}

// ================================
// Domaine Finances - Types partagés
// ================================

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

export interface BarItem {
  label: string;
  compte: string;
  prevus_2024: number;
  realises_2024: number;
  propositions_2025: number;
  color: string;
}

export interface OverviewData {
  metadata: {
    title: string;
    periods: {
      budget_2024: string;
      actual_2024: string;
      budget_2025: string;
    };
    columns: {
      compte: string;
      libelle: string;
      prevus_2024: string;
      realises_2024: string;
      propositions_2025: string;
      notes: string;
    };
  };
  sections: Array<{
    type: string;
    title: string;
    highlight_color?: string;
    items: Array<{
      compte?: string;
      libelle: string;
      prevus_2024: number;
      realises_2024: number;
      propositions_2025: number;
      notes: string;
    }>;
    total?: {
      libelle: string;
      prevus_2024: number;
      realises_2024: number;
      propositions_2025: number;
    };
  }>;
}

export interface DrillDownItem {
  compte: string;
  libelle: string;
  prevus_2024: number;
  realises_2024: number;
  propositions_2025: number;
  type: 'expense' | 'income';
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
  population_putanges_le_lac: number;
  valeur_putanges_le_lac_par_habitant: number;
  mediane_echantillon_par_habitant: number;
  classement_putanges_le_lac_sur_129: number;
  premier_decile_par_habitant: number;
  dernier_decile_par_habitant: number;
  commentaires: string;
}

export interface DonutChartProps {
  data: AggregatedData[];
  title: string;
  chartId: string;
  enableDrillDown?: boolean;
  onsegmentclick?: (event: CustomEvent<{ category: string; value: number; index: number }>) => void;
}

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

export interface ChartDataItem {
  label: string;
  prevus_2024: number;
  realises_2024: number;
  propositions_2025: number;
}

export interface DetailItem {
  category: string;
  compte: string;
  libelle: string;
  montant_prevu?: number;
  montant_realise?: number;
  montant_propose?: number;
}
