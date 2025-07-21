/**
 * UTILITAIRES DE PARSING CSV
 * ==========================
 *
 * Module contenant les fonctions communes pour le parsing de fichiers CSV
 * Partagé entre les différents scripts de conversion CSV→JSON
 *
 * @author MCCP - Mouvement Citoyen des Communes de Putanges-le-Lac
 * @version 1.0.0
 */

/**
 * Parse une ligne CSV en tenant compte des guillemets et échappements
 * @param {string} line - Ligne CSV à parser
 * @param {string} separator - Séparateur utilisé (par défaut ';')
 * @returns {string[]} Tableau des valeurs parsées
 */
export function parseCSVLine(line, separator = ';') {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === separator && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
    i++;
  }

  // Ajouter le dernier élément
  result.push(current.trim());

  return result;
}

/**
 * Convertit les en-têtes CSV vers les clés JSON en utilisant un mapping
 * @param {string[]} headers - En-têtes du CSV
 * @param {Object} columnMapping - Mapping des colonnes (clé = header CSV, valeur = clé JSON)
 * @returns {string[]} Clés JSON correspondantes
 */
export function mapHeaders(headers, columnMapping = {}) {
  return headers.map((header) => {
    const trimmedHeader = header.trim();
    return columnMapping[trimmedHeader] || trimmedHeader.replace(/[^\w]/g, '_');
  });
}

/**
 * Nettoie et convertit une valeur monétaire française en nombre
 * @param {string} value - Valeur à nettoyer (ex: "100 000,50 €")
 * @returns {number} Nombre converti ou 0 si invalide
 */
export function cleanNumericValue(value) {
  if (!value || typeof value !== 'string') {
    return 0;
  }

  try {
    // Supprimer les espaces, le symbole € et autres caractères non numériques
    let cleaned = value
      .replace(/\s+/g, '') // Supprimer tous les espaces
      .replace(/€/g, '') // Supprimer le symbole €
      .replace(/,/g, '.') // Remplacer virgule par point
      .trim();

    // Si la chaîne est vide après nettoyage, retourner 0
    if (cleaned === '' || cleaned === '-') {
      return 0;
    }

    // Convertir en nombre
    const number = parseFloat(cleaned);

    // Vérifier si c'est un nombre valide
    if (isNaN(number)) {
      console.warn(`⚠️  Valeur numérique invalide après nettoyage: "${value}" → "${cleaned}"`);
      return 0;
    }

    return number;
  } catch (error) {
    console.warn(
      `⚠️  Erreur lors du nettoyage de la valeur numérique "${value}": ${error.message}`
    );
    return 0;
  }
}

/**
 * Nettoie et convertit une valeur textuelle française en booléen
 * @param {string} value - Valeur à convertir ("oui", "non", etc.)
 * @returns {boolean} Booléen converti
 */
export function cleanBooleanValue(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const trimmedValue = value.trim().toLowerCase();

  // Conversion selon les valeurs françaises courantes
  switch (trimmedValue) {
    case 'oui':
    case 'o':
    case 'true':
    case '1':
    case 'vrai':
      return true;
    case 'non':
    case 'n':
    case 'false':
    case '0':
    case 'faux':
      return false;
    default:
      console.warn(`⚠️  Valeur booléenne non reconnue: "${value}" - conversion en false`);
      return false;
  }
}

/**
 * Convertit une ligne de données CSV en objet JSON
 * @param {string[]} values - Valeurs de la ligne
 * @param {string[]} jsonKeys - Clés JSON correspondantes
 * @param {string[]} numericFields - Liste des champs numériques
 * @param {string[]} booleanFields - Liste des champs booléens
 * @returns {Object} Objet JSON de la ligne
 */
export function convertLineToJSON(values, jsonKeys, numericFields = [], booleanFields = []) {
  const obj = {};

  jsonKeys.forEach((key, index) => {
    const rawValue = values[index] || '';
    const trimmedValue = rawValue.trim();

    // Appliquer le nettoyage numérique si c'est un champ numérique
    if (numericFields.includes(key)) {
      obj[key] = cleanNumericValue(trimmedValue);
    } else if (booleanFields.includes(key)) {
      obj[key] = cleanBooleanValue(trimmedValue);
    } else {
      obj[key] = trimmedValue;
    }
  });

  return obj;
}
