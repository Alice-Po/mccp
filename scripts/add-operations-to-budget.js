#!/usr/bin/env node

/**
 * Enrichit base_budget_<annee>.json avec le libellé d'opération
 * en s'appuyant sur table-correspondance-operation-investissement.json
 *
 * Usage simple (KISS):
 *   node scripts/add-operations-to-budget.js --year 2025
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
  // Nom de la table après renommage (correspondance et non conrrespondance)
  const table = `public/assets/datas/${year}/table_operations_${year}.json`;
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

function buildOperationIndex(tableRows) {
  const map = new Map();
  for (const row of tableRows) {
    const code = String(row.code ?? '').trim();
    const lib = String(row.libelle ?? '').trim();
    if (!code || !lib) continue;
    map.set(code, { libelle: lib, budget_dep: row.budget_dep, realise_dep: row.realise_dep });
  }
  return map;
}

function extractOperationCodeFromCompte(compteValue) {
  // Exemple: 2131B-0029, 2031-2021004, 21588-2021004
  // Règle: on prend la chaîne après le dernier '-' et on garde les chiffres/lettres (zéros initiaux inclus)
  if (!compteValue || typeof compteValue !== 'string') return null;
  const lastDash = compteValue.lastIndexOf('-');
  if (lastDash === -1) return null;
  const suffix = compteValue.slice(lastDash + 1).trim();
  // Garder alphanum complet (ex: 0029)
  const m = suffix.match(/^[0-9A-Za-z]+$/);
  if (!m) return null;
  return suffix;
}

function enrich(baseRows, opIndex) {
  let investCount = 0;
  let detectedOps = 0;
  let enriched = 0;
  const missing = new Set();

  const outRows = baseRows.map((row) => {
    if (row && row.SECTION === 'INVESTISSEMENT') {
      investCount++;
      const compte = row.COMPTE;
      const code = extractOperationCodeFromCompte(compte);
      if (code) {
        detectedOps++;
        const entry = opIndex.get(code);
        // Toujours poser le code détecté
        const newRow = { ...row, OPERATION_CODE: code };
        if (entry) {
          // Écrase toujours le champ demandé
          newRow.regroupement_focale_n2 = entry.libelle;
          enriched++;
        } else {
          missing.add(code);
        }
        return newRow;
      }
    }
    // Aucun code détecté: si c'est une dépense d'investissement (niveau focale 1),
    // alors positionner une valeur générique sur regroupement_focale_n2
    if (row && row.regroupement_focale_n1 === "dépenses d'investissement" && !row.OPERATION_CODE) {
      const newRow = { ...row };
      newRow.regroupement_focale_n2 = "Autres dépenses d'investissement";
      return newRow;
    }
    return row;
  });

  return {
    outRows,
    stats: { investCount, detectedOps, enriched, missing: Array.from(missing).sort() },
  };
}

async function main() {
  try {
    const args = parseArgs(process.argv);
    const { base: basePath, table: tablePath, out: outPath } = buildPaths(args.year);

    console.log('Année:', args.year);
    console.log('Base:', basePath);
    console.log('Table:', tablePath);
    console.log('Out:', outPath);

    const baseRows = readJSON(basePath);
    const tableRows = readJSON(tablePath);
    const opIndex = buildOperationIndex(tableRows);

    const { outRows, stats } = enrich(baseRows, opIndex);

    console.log(`SECTION=INVESTISSEMENT: ${stats.investCount}`);
    console.log(`Opérations détectées via COMPTE: ${stats.detectedOps}`);
    console.log(`Entrées enrichies: ${stats.enriched}`);
    if (stats.missing.length) {
      console.log(
        `Codes sans correspondance (${stats.missing.length}): ${stats.missing.join(', ')}`
      );
    }

    // Écriture en place
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    writeJSON(outPath, outRows);
    console.log('Écrit:', outPath);
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { extractOperationCodeFromCompte, buildOperationIndex, enrich };
