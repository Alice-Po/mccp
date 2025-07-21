#!/usr/bin/env node

/**
 * SCRIPT DE CONVERSION BUDGET CSV VERS JSON
 * ========================================
 *
 * DESCRIPTION
 * -----------
 * Ce script convertit un fichier CSV de données budgétaires en format JSON structuré.
 * Il est spécialement conçu pour traiter les fichiers de budget municipal avec les colonnes
 * françaises standard et produire un JSON compatible avec les applications web.
 *
 * FONCTIONNALITÉS
 * ---------------
 * - Lecture et parsing automatique des fichiers CSV avec séparateur point-virgule
 * - Conversion des en-têtes français vers des clés JSON normalisées
 * - Nettoyage et conversion automatique des données numériques (suppression €, espaces)
 * - Conversion des champs financiers en nombres JavaScript
 * - Conversion des champs textuels français en booléens ("oui"→true, "non"→false)
 * - Validation des données d'entrée
 * - Gestion des erreurs et messages informatifs
 * - Génération automatique du nom de fichier de sortie
 *
 * UTILISATION
 * -----------
 * node scripts/convert-budget-csv-to-json.js [chemin-fichier-csv]
 *
 * Exemples :
 * node scripts/convert-budget-csv-to-json.js public/assets/datas/2025/base_budget_2025.csv
 * node scripts/convert-budget-csv-to-json.js data/budget.csv
 *
 * ENTRÉE
 * ------
 * Fichier CSV avec les colonnes suivantes (séparées par point-virgule) :
 * - DÉPENSES/RECETTES
 * - SECTION
 * - COMPTE
 * - LIBELLE
 * - regroupement : focale n°1
 * - regroupement : focale n°2
 * - pour comparaison prévision / réalisation (selon focale n°1)
 * - CHAPITRE (officiel)
 * - PREVISIONS_2024
 * - REALISATIONS_2024
 * - PROPOSITIONS_2025
 * - TAUX_EXECUTION_2024
 * - EVOLUTION_2024_2025_ABSOLUE
 * - EVOLUTION_2024_2025_RELATIVE
 *
 * SORTIE
 * ------
 * Fichier JSON avec structure :
 * [
 *   {
 *     "DÉPENSES/RECETTES": "DEPENSES",
 *     "SECTION": "FONCTIONNEMENT",
 *     "COMPTE": "60221",
 *     "LIBELLE": "Combustibles et carburants",
 *     "regroupement_focale_n1": "dépenses courantes de fonctionnement",
 *     "regroupement_focale_n2": "fluides : eau, énergie et carburants",
 *     "pour_comparaison_prévision_réalisation": true,
 *     "CHAPITRE_officiel": "CHARGES A CARACTERE GENERAL",
 *     "PREVISIONS_2024": 0,
 *     "REALISATIONS_2024": 0,
 *     "PROPOSITIONS_2025": 0,
 *     "TAUX_EXECUTION_2024": 0,
 *     "EVOLUTION_2024_2025_ABSOLUE": 0,
 *     "EVOLUTION_2024_2025_RELATIVE": 0
 *   },
 *   ...
 * ]
 *
 * DÉPENDANCES
 * -----------
 * - Node.js (version 14+)
 * - Support ES6 modules
 *
 * LIMITATIONS
 * -----------
 * - Lecture complète en mémoire (non adapté aux fichiers > 100MB)
 * - Pas de validation stricte du schéma CSV
 * - Format de sortie fixe (pas configurable)
 *
 * AUTEUR
 * ------
 * Généré pour le projet MCCP - Mouvement Citoyen des Communes de Putanges-le-Lac
 *
 * VERSION
 * -------
 * 1.0.0 -  initial version
 *
 * LICENCE
 * -------
 * Usage interne au projet MCCP
 */

import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { dirname, basename, extname, join } from 'path';
import { fileURLToPath } from 'url';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);

/**
 * Configuration du script
 */
const CONFIG = {
  // Séparateur utilisé dans le fichier CSV
  CSV_SEPARATOR: ';',

  // Encodage des fichiers
  FILE_ENCODING: 'utf8',

  // Indentation pour le JSON de sortie (2 espaces)
  JSON_INDENT: 2,

  // Mapping des en-têtes CSV vers les clés JSON
  COLUMN_MAPPING: {
    'DÉPENSES/RECETTES': 'DÉPENSES/RECETTES',
    SECTION: 'SECTION',
    COMPTE: 'COMPTE',
    LIBELLE: 'LIBELLE',
    'regroupement : focale n°1': 'regroupement_focale_n1',
    'regroupement : focale n°2': 'regroupement_focale_n2',
    'pour comparaison prévision / réalisation (selon focale n°1)':
      'pour_comparaison_prévision_réalisation',
    'CHAPITRE (officiel)': 'CHAPITRE_officiel',
    PREVISIONS_2024: 'PREVISIONS_2024',
    REALISATIONS_2024: 'REALISATIONS_2024',
    PROPOSITIONS_2025: 'PROPOSITIONS_2025',
    TAUX_EXECUTION_2024: 'TAUX_EXECUTION_2024',
    EVOLUTION_2024_2025_ABSOLUE: 'EVOLUTION_2024_2025_ABSOLUE',
    EVOLUTION_2024_2025_RELATIVE: 'EVOLUTION_2024_2025_RELATIVE',
  },

  // Champs qui doivent être traités comme des nombres
  NUMERIC_FIELDS: [
    'PREVISIONS_2024',
    'REALISATIONS_2024',
    'PROPOSITIONS_2025',
    'TAUX_EXECUTION_2024',
    'EVOLUTION_2024_2025_ABSOLUE',
    'EVOLUTION_2024_2025_RELATIVE',
  ],

  // Champs qui doivent être traités comme des booléens
  BOOLEAN_FIELDS: ['pour_comparaison_prévision_réalisation'],
};

/**
 * Affiche l'aide du script
 */
function showHelp() {
  console.log(`
SCRIPT DE CONVERSION BUDGET CSV VERS JSON
==========================================

Usage: node ${basename(__filename)} [chemin-fichier-csv]

Arguments:
  chemin-fichier-csv    Chemin vers le fichier CSV à convertir

Exemples:
  node ${basename(__filename)} public/assets/datas/2025/base_budget_2025.csv
  node ${basename(__filename)} data/budget.csv

Le fichier JSON sera généré dans le même dossier avec l'extension .json
    `);
}

/**
 * Valide si un fichier existe et est lisible
 * @param {string} filePath - Chemin vers le fichier
 * @returns {boolean} True si le fichier est valide
 */
function validateInputFile(filePath) {
  try {
    if (!existsSync(filePath)) {
      console.error(`❌ Erreur: Le fichier "${filePath}" n'existe pas.`);
      return false;
    }

    const stats = statSync(filePath);
    if (!stats.isFile()) {
      console.error(`❌ Erreur: "${filePath}" n'est pas un fichier.`);
      return false;
    }

    // Vérification de l'extension
    if (!filePath.toLowerCase().endsWith('.csv')) {
      console.warn(
        `⚠️  Attention: Le fichier ne semble pas être un CSV (extension: ${extname(filePath)})`
      );
    }

    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de la validation du fichier: ${error.message}`);
    return false;
  }
}

/**
 * Parse une ligne CSV en tenant compte des guillemets et échappements
 * @param {string} line - Ligne CSV à parser
 * @param {string} separator - Séparateur utilisé
 * @returns {string[]} Tableau des valeurs parsées
 */
function parseCSVLine(line, separator = CONFIG.CSV_SEPARATOR) {
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
 * Convertit les en-têtes CSV vers les clés JSON
 * @param {string[]} headers - En-têtes du CSV
 * @returns {string[]} Clés JSON correspondantes
 */
function mapHeaders(headers) {
  return headers.map((header) => {
    const trimmedHeader = header.trim();
    return CONFIG.COLUMN_MAPPING[trimmedHeader] || trimmedHeader.replace(/[^\w]/g, '_');
  });
}

/**
 * Nettoie et convertit une valeur monétaire française en nombre
 * @param {string} value - Valeur à nettoyer (ex: "100 000,50 €")
 * @returns {number} Nombre converti ou 0 si invalide
 */
function cleanNumericValue(value) {
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
    if (cleaned === '') {
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
 * Détermine si un champ doit être traité comme numérique
 * @param {string} fieldName - Nom du champ
 * @returns {boolean} True si le champ est numérique
 */
function isNumericField(fieldName) {
  return CONFIG.NUMERIC_FIELDS.includes(fieldName);
}

/**
 * Nettoie et convertit une valeur textuelle française en booléen
 * @param {string} value - Valeur à convertir ("oui", "non", etc.)
 * @returns {boolean} Booléen converti
 */
function cleanBooleanValue(value) {
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
 * Détermine si un champ doit être traité comme booléen
 * @param {string} fieldName - Nom du champ
 * @returns {boolean} True si le champ est booléen
 */
function isBooleanField(fieldName) {
  return CONFIG.BOOLEAN_FIELDS.includes(fieldName);
}

/**
 * Convertit une ligne de données CSV en objet JSON
 * @param {string[]} values - Valeurs de la ligne
 * @param {string[]} jsonKeys - Clés JSON correspondantes
 * @returns {Object} Objet JSON de la ligne
 */
function convertLineToJSON(values, jsonKeys) {
  const obj = {};

  jsonKeys.forEach((key, index) => {
    const rawValue = values[index] || '';
    const trimmedValue = rawValue.trim();

    // Appliquer le nettoyage numérique si c'est un champ numérique
    if (isNumericField(key)) {
      obj[key] = cleanNumericValue(trimmedValue);
    } else if (isBooleanField(key)) {
      obj[key] = cleanBooleanValue(trimmedValue);
    } else {
      obj[key] = trimmedValue;
    }
  });

  return obj;
}

/**
 * Génère le chemin du fichier de sortie JSON
 * @param {string} inputPath - Chemin du fichier d'entrée
 * @returns {string} Chemin du fichier de sortie
 */
function generateOutputPath(inputPath) {
  const dir = dirname(inputPath);
  const baseName = basename(inputPath, extname(inputPath));
  return join(dir, `${baseName}.json`);
}

/**
 * Fonction principale de conversion
 * @param {string} inputPath - Chemin du fichier CSV d'entrée
 */
async function convertCSVToJSON(inputPath) {
  try {
    console.log(`📂 Lecture du fichier: ${inputPath}`);

    // Lecture du fichier CSV
    const csvContent = readFileSync(inputPath, CONFIG.FILE_ENCODING);
    const lines = csvContent.split('\n').filter((line) => line.trim() !== '');

    if (lines.length === 0) {
      throw new Error('Le fichier CSV est vide');
    }

    console.log(`📊 Nombre de lignes détectées: ${lines.length}`);

    // Parse de la première ligne (en-têtes)
    const headers = parseCSVLine(lines[0]);
    const jsonKeys = mapHeaders(headers);

    console.log(`🏷️  Colonnes détectées: ${headers.length}`);
    console.log(`🔄 Mapping des colonnes:`);
    headers.forEach((header, index) => {
      console.log(`   "${header}" → "${jsonKeys[index]}"`);
    });

    // Conversion des données
    const jsonData = [];
    let errorCount = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);

        if (values.length !== headers.length) {
          console.warn(
            `⚠️  Ligne ${i + 1}: Nombre de colonnes incorrect (attendu: ${
              headers.length
            }, trouvé: ${values.length})`
          );
          errorCount++;
          continue;
        }

        const jsonObject = convertLineToJSON(values, jsonKeys);
        jsonData.push(jsonObject);
      } catch (error) {
        console.error(`❌ Erreur ligne ${i + 1}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`✅ Lignes converties avec succès: ${jsonData.length}`);
    if (errorCount > 0) {
      console.log(`⚠️  Lignes avec erreurs: ${errorCount}`);
    }

    // Génération du fichier JSON
    const outputPath = generateOutputPath(inputPath);
    const jsonString = JSON.stringify(jsonData, null, CONFIG.JSON_INDENT);

    writeFileSync(outputPath, jsonString, CONFIG.FILE_ENCODING);

    // Statistiques finales
    const outputStats = statSync(outputPath);
    console.log(`📝 Fichier JSON généré: ${outputPath}`);
    console.log(`📏 Taille du fichier: ${(outputStats.size / 1024).toFixed(2)} KB`);
    console.log(`🎯 Conversion terminée avec succès!`);

    return outputPath;
  } catch (error) {
    console.error(`❌ Erreur lors de la conversion: ${error.message}`);
    throw error;
  }
}

/**
 * Point d'entrée principal du script
 */
async function main() {
  try {
    // Vérification des arguments
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
      showHelp();
      process.exit(0);
    }

    const inputPath = args[0];

    console.log('🚀 DÉMARRAGE DE LA CONVERSION CSV → JSON');
    console.log('==========================================\n');

    // Validation du fichier d'entrée
    if (!validateInputFile(inputPath)) {
      process.exit(1);
    }

    // Conversion
    await convertCSVToJSON(inputPath);

    console.log('\n🎉 CONVERSION TERMINÉE AVEC SUCCÈS!');
  } catch (error) {
    console.error(`\n💥 ERREUR CRITIQUE: ${error.message}`);
    process.exit(1);
  }
}

// Vérification si le script est exécuté directement (équivalent ES6 de require.main === module)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Export pour utilisation comme module ES6
export {
  convertCSVToJSON,
  parseCSVLine,
  mapHeaders,
  convertLineToJSON,
  generateOutputPath,
  cleanNumericValue,
  isNumericField,
  cleanBooleanValue,
  isBooleanField,
  CONFIG,
};
