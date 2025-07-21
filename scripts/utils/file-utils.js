/**
 * UTILITAIRES DE GESTION DE FICHIERS
 * ==================================
 *
 * Module contenant les fonctions communes pour la validation et manipulation de fichiers
 * Partagé entre les différents scripts de conversion CSV→JSON
 *
 * @author MCCP - Mouvement Citoyen des Communes de Putanges-le-Lac
 * @version 1.0.0
 */

import { existsSync, statSync } from 'fs';
import { dirname, basename, extname, join } from 'path';

/**
 * Valide si un fichier existe et est lisible
 * @param {string} filePath - Chemin vers le fichier
 * @returns {boolean} True si le fichier est valide
 */
export function validateInputFile(filePath) {
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
 * Génère le chemin du fichier de sortie JSON
 * @param {string} inputPath - Chemin du fichier d'entrée
 * @returns {string} Chemin du fichier de sortie
 */
export function generateOutputPath(inputPath) {
  const dir = dirname(inputPath);
  const baseName = basename(inputPath, extname(inputPath));
  return join(dir, `${baseName}.json`);
}

/**
 * Affiche l'aide du script
 * @param {string} scriptName - Nom du script pour l'aide
 * @param {string} description - Description du script
 * @param {string} example - Exemple d'utilisation
 */
export function showHelp(scriptName, description, example) {
  console.log(`
${description}
${'='.repeat(description.length)}

Usage: node ${scriptName} [chemin-fichier-csv]

Arguments:
  chemin-fichier-csv    Chemin vers le fichier CSV à convertir

Exemples:
  ${example}

Le fichier JSON sera généré dans le même dossier avec l'extension .json
    `);
}
