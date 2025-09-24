export function iconPathForCategory(category: string): string {
  const key = String(category || '').toLowerCase();
  // Normalisations simples
  const mappings: Record<string, string> = {
    'administratif ou militaire': '/assets/svg/zae/admin-militaire.svg',
    religieux: '/assets/svg/zae/religieux.svg',
    'culture et loisirs': '/assets/svg/zae/culture-loisirs.svg',
    'gestion des eaux': '/assets/svg/zae/gestion-eaux.svg',
    'industriel et commercial': '/assets/svg/zae/industrie-commerce.svg',
    santé: '/assets/svg/zae/sante.svg',
    'science et enseignement': '/assets/svg/zae/science-enseignement.svg',
    sport: '/assets/svg/zae/sport.svg',
  };
  return mappings[key] || '/assets/svg/zae/industrie-commerce.svg';
}
