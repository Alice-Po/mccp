#!/usr/bin/env node

/**
 * Enrichit base_budget_<annee>.json avec des libellés vulgarisés
 * en s'appuyant sur table_correspondance_libelles_vulgarises.json
 *
 * Usage simple (KISS):
 *   node scripts/add-vulgarized-labels.js --year 2025
 *
 * Options:
 *   --year <YYYY>   Année à traiter (défaut: 2025)
 */

import fs from 'fs';
import path from 'path';

function parseArgs(argv) {
  const args = { year: '2025' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--year' || a === '-y') args.year = argv[++i];
  }
  return args;
}

function buildPaths(year) {
  const base = `public/assets/datas/${year}/base_budget_${year}.json`;
  const table = `public/assets/datas/${year}/table_correspondance_libelles_vulgarises.json`;
  const out = base; // écriture en place
  return { base, table, out };
}

function readJSON(p) {
  const txt = fs.readFileSync(p, 'utf8');
  return JSON.parse(txt);
}

function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

function buildVulgarizedLabelsIndex(tableRows) {
  const map = new Map();
  for (const row of tableRows) {
    const original = String(row.libelle_original ?? '').trim();
    const vulgarized = String(row.libelle_vulgarise ?? '').trim();
    if (!original || !vulgarized) continue;
    map.set(original, vulgarized);
  }
  return map;
}

function enrich(baseRows, vulgarizedIndex) {
  let totalCount = 0;
  let matchedCount = 0;
  const missing = new Set();

  const outRows = baseRows.map((row) => {
    if (!row || typeof row !== 'object') return row;

    totalCount++;
    const libelle = String(row.LIBELLE ?? '').trim();

    if (!libelle) return row;

    const newRow = { ...row }; // Create a copy to modify

    if (vulgarizedIndex.has(libelle)) {
      newRow.libelle_vulgarise = vulgarizedIndex.get(libelle);
      matchedCount++;
    } else {
      missing.add(libelle);
    }

    return newRow;
  });

  return {
    outRows,
    stats: {
      totalCount,
      matchedCount,
      missing: Array.from(missing).sort(),
    },
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const { base, table, out } = buildPaths(args.year);

  console.log(`🔍 Enrichissement des libellés vulgarisés pour l'année ${args.year}`);
  console.log(`📁 Base: ${base}`);
  console.log(`📋 Table: ${table}`);
  console.log(`💾 Sortie: ${out}`);

  try {
    // Vérifier que les fichiers existent
    if (!fs.existsSync(base)) {
      throw new Error(`Fichier base manquant: ${base}`);
    }
    if (!fs.existsSync(table)) {
      throw new Error(`Fichier table manquant: ${table}`);
    }

    // Charger les données
    console.log('📖 Chargement des données...');
    const baseRows = readJSON(base);
    const tableRows = readJSON(table);

    if (!Array.isArray(baseRows)) {
      throw new Error('Le fichier base doit contenir un tableau JSON');
    }
    if (!Array.isArray(tableRows)) {
      throw new Error('Le fichier table doit contenir un tableau JSON');
    }

    // Construire l'index des libellés vulgarisés
    console.log("🔧 Construction de l'index des libellés vulgarisés...");
    const vulgarizedIndex = buildVulgarizedLabelsIndex(tableRows);
    console.log(`📊 Index construit: ${vulgarizedIndex.size} libellés vulgarisés`);

    // Enrichir les données
    console.log('✨ Enrichissement en cours...');
    const { outRows, stats } = enrich(baseRows, vulgarizedIndex);

    // Afficher les statistiques
    console.log('\n📈 Statistiques:');
    console.log(`   Total d'éléments traités: ${stats.totalCount}`);
    console.log(`   Libellés vulgarisés ajoutés: ${stats.matchedCount}`);
    console.log(
      `   Taux de correspondance: ${Math.round((stats.matchedCount / stats.totalCount) * 100)}%`
    );

    if (stats.missing.length > 0) {
      console.log(`\n⚠️  Libellés non trouvés (${stats.missing.length}):`);
      stats.missing.slice(0, 10).forEach((libelle) => {
        console.log(`   - "${libelle}"`);
      });
      if (stats.missing.length > 10) {
        console.log(`   ... et ${stats.missing.length - 10} autres`);
      }
    }

    // Écrire le résultat
    console.log(`\n💾 Écriture du résultat dans ${out}...`);
    writeJSON(out, outRows);

    console.log('✅ Enrichissement terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();




