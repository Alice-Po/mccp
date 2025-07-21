#!/usr/bin/env node

/**
 * SCRIPT DE CONVERSION COMPARAISON CSV VERS JSON
 * ==============================================
 *
 * DESCRIPTION
 * -----------
 * Ce script convertit un fichier CSV de données de comparaison budgétaire en format JSON structuré.
 * Il est spécialement conçu pour traiter les fichiers de comparaison entre communes avec les colonnes
 * françaises standard et produire un JSON compatible avec les applications web.
 *
 * FONCTIONNALITÉS
 * ---------------
 * - Lecture et parsing automatique des fichiers CSV avec séparateur point-virgule
 * - Conversion des en-têtes français vers des clés JSON normalisées
 * - Nettoyage et conversion automatique des données numériques (suppression €, espaces)
 * - Conversion des champs financiers en nombres JavaScript
 * - Conversion des champs textuels français en booléens ("Oui"→true, "Non"→false)
 * - Validation des données d'entrée
 * - Gestion des erreurs et messages informatifs
 * - Génération automatique du nom de fichier de sortie
 *
 * UTILISATION
 * -----------
 * node scripts/convert-comparaison-csv-to-json.js [chemin-fichier-csv]
 *
 * Exemples :
 * node scripts/convert-comparaison-csv-to-json.js public/assets/datas/2025/base_comparaison_2025.csv
 * node scripts/convert-comparaison-csv-to-json.js data/comparaison.csv
 *
 * ENTRÉE
 * ------
 * Fichier CSV avec les colonnes suivantes (séparées par point-virgule) :
 * - exercice
 * - département
 * - commune rurale
 * - commune touristique
 * - tranche revenu par habitant
 * - commune
 * - agrégat
 * - montant
 * - population
 * - montant par habitant
 *
 * SORTIE
 * ------
 * Fichier JSON avec structure :
 * [
 *   {
 *     "exercice": "2023",
 *     "département": "Calvados",
 *     "commune_rurale": true,
 *     "commune_touristique": false,
 *     "tranche_revenu_par_habitant": "3",
 *     "commune": "Colomby-Anguerny",
 *     "agrégat": "Achats et charges externes",
 *     "montant": 88368.03,
 *     "population": 1276,
 *     "montant_par_habitant": 69.25
 *   },
 *   ...
 * ]
 *
 * DÉPENDANCES
 * -----------
 * - Node.js (version 14+)
 * - Support ES6 modules
 * - Modules utilitaires dans ./utils/
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
 * 1.0.0 - Version initiale
 *
 * LICENCE
 * -------
 * Usage interne au projet MCCP
 */

import { readFileSync, writeFileSync, statSync } from 'fs';
import { basename } from 'path';
import { fileURLToPath } from 'url';
import process from 'node:process';

// Import des utilitaires communs
import { parseCSVLine, mapHeaders, convertLineToJSON } from './utils/csv-parser.js';

import { validateInputFile, generateOutputPath, showHelp } from './utils/file-utils.js';

// Équivalent de __filename pour ES modules
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
    exercice: 'exercice',
    département: 'département',
    'commune rurale': 'commune_rurale',
    'commune touristique': 'commune_touristique',
    'tranche revenu par habitant': 'tranche_revenu_par_habitant',
    commune: 'commune',
    agrégat: 'agrégat',
    montant: 'montant',
    population: 'population',
    'montant par habitant': 'montant_par_habitant',
  },

  // Champs qui doivent être traités comme des nombres
  NUMERIC_FIELDS: ['montant', 'population', 'montant_par_habitant'],

  // Champs qui doivent être traités comme des booléens
  BOOLEAN_FIELDS: ['commune_rurale', 'commune_touristique'],
};

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
    const headers = parseCSVLine(lines[0], CONFIG.CSV_SEPARATOR);
    const jsonKeys = mapHeaders(headers, CONFIG.COLUMN_MAPPING);

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
        const values = parseCSVLine(lines[i], CONFIG.CSV_SEPARATOR);

        if (values.length !== headers.length) {
          console.warn(
            `⚠️  Ligne ${i + 1}: Nombre de colonnes incorrect (attendu: ${
              headers.length
            }, trouvé: ${values.length})`
          );
          errorCount++;
          continue;
        }

        const jsonObject = convertLineToJSON(
          values,
          jsonKeys,
          CONFIG.NUMERIC_FIELDS,
          CONFIG.BOOLEAN_FIELDS
        );
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
      showHelp(
        basename(__filename),
        'SCRIPT DE CONVERSION COMPARAISON CSV → JSON',
        `node ${basename(__filename)} public/assets/datas/2025/base_comparaison_2025.csv`
      );
      process.exit(0);
    }

    const inputPath = args[0];

    console.log('🚀 DÉMARRAGE DE LA CONVERSION COMPARAISON CSV → JSON');
    console.log('================================================\n');

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
export { convertCSVToJSON, CONFIG };
