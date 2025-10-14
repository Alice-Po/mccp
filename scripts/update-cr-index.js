#!/usr/bin/env node
// Note: This script scans CR PDFs, OCRs non-readable ones using ocrmypdf,
// then rebuilds public/assets/datas/ocr_index.json with metadata.

import { readdir, stat, writeFile, access, unlink } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { execFile } from 'node:child_process';
import process from 'node:process';

const ROOT = '/home/alice/projets/MCCP';
const CR_DIR = join(ROOT, 'public/assets/datas/CR-municipaux');
const OUT_INDEX = join(ROOT, 'public/assets/datas/ocr_index.json');

function execFileP(cmd, args) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, (error, stdout, stderr) => {
      if (error) {
        const err = new Error(stderr || stdout || error.message);
        err.code = error.code;
        return reject(err);
      }
      resolve({ stdout, stderr });
    });
  });
}

function isPdf(fileName) {
  return fileName.toLowerCase().endsWith('.pdf');
}

function isReadable(fileName) {
  return /_readable\.pdf$/i.test(fileName);
}

function toReadableName(fileName) {
  const name = basename(fileName, extname(fileName));
  if (name.endsWith('_readable')) return `${name}.pdf`;
  return `${name}_readable.pdf`;
}

function parseEventDateFromName(fileName) {
  // Tries YYYY-MM-DD or DD-MM-YYYY within the name
  const iso = fileName.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const dmy = fileName.match(/\b(\d{2})-(\d{2})-(20\d{2})\b/);
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
  return null;
}

function hasStrictDmyDate(fileName) {
  // Strict dd-mm-yyyy anywhere in the filename
  return /\b\d{2}-\d{2}-\d{4}\b/.test(fileName);
}

async function ensureOcrmypdfAvailable() {
  try {
    await execFileP('ocrmypdf', ['--version']);
    return true;
  } catch {
    return false;
  }
}

async function ocrIfNeeded(fileName) {
  if (!isPdf(fileName) || isReadable(fileName)) return null;
  const srcAbs = join(CR_DIR, fileName);
  const dstName = toReadableName(fileName);
  const dstAbs = join(CR_DIR, dstName);
  try {
    await access(dstAbs);
    // La version lisible existe déjà : on supprime l'original pour ne garder que la version lisible
    try {
      await unlink(srcAbs);
    } catch (e) {
      console.warn(
        `[update-cr-index] ⚠️ Impossible de supprimer l'original ${fileName} :`,
        e?.message || e
      );
    }
    return dstName; // already exists
  } catch {
    // continue
  }
  const hasOcr = await ensureOcrmypdfAvailable();
  if (!hasOcr) {
    throw new Error(
      "L'outil 'ocrmypdf' n'est pas installé. Installez-le puis réessayez : sudo apt install ocrmypdf"
    );
  }
  // Langue française, optimisation, redressement/rotation, ignorer les pages déjà textuelles
  await execFileP('ocrmypdf', [
    '--optimize',
    '3',
    '--rotate-pages',
    '--deskew',
    '--skip-text',
    '--language',
    'fra',
    srcAbs,
    dstAbs,
  ]);
  // Après OCR réussi, supprimer le fichier original non lisible
  try {
    await unlink(srcAbs);
  } catch (e) {
    console.warn(
      `[update-cr-index] ⚠️ Impossible de supprimer l'original ${fileName} :`,
      e?.message || e
    );
  }
  return dstName;
}

async function cleanupRedundantSources() {
  // NOTE: Opportunité d'optimisation KISS:
  // Au lieu d'effectuer plusieurs passes (cleanupRedundantSources → OCR → buildIndex),
  // on peut réaliser une seule passe sur CR_DIR qui:
  // 1) construit baseToReadable (choix de la version à garder),
  // 2) supprime immédiatement l'original si *_readable.pdf existe,
  // 3) OCRise uniquement les bases sans version *_readable.pdf (avec une petite concurrence bornée),
  // 4) génère directement l'index final.
  // Cela réduit les I/O et simplifie le flux global, au prix d'un contrôle de flux un peu plus dense.
  const files = await readdir(CR_DIR);
  const fileSet = new Set(files);
  for (const f of files) {
    if (isPdf(f) && !isReadable(f)) {
      const readable = toReadableName(f);
      if (fileSet.has(readable)) {
        try {
          await unlink(join(CR_DIR, f));
        } catch (e) {
          console.warn(
            `[update-cr-index] ⚠️ Impossible de supprimer le doublon ${f} :`,
            e?.message || e
          );
        }
      }
    }
  }
}

async function buildIndex() {
  const files = (await readdir(CR_DIR)).filter(isPdf);

  // Prefer readable versions if both exist
  const baseToReadable = new Map();
  for (const f of files) {
    const base = f.replace(/_readable\.pdf$/i, '.pdf');
    const current = baseToReadable.get(base);
    const prefer = isReadable(f) ? f : current || f;
    // If we already have a readable, keep it; else keep whatever we saw
    if (!current || isReadable(prefer)) baseToReadable.set(base, prefer);
  }

  const entries = [];
  for (const [base, chosen] of baseToReadable.entries()) {
    const abs = join(CR_DIR, chosen);
    const st = await stat(abs);
    const eventDate = parseEventDateFromName(chosen) || parseEventDateFromName(base);
    const year = eventDate ? Number(eventDate.slice(0, 4)) : new Date(st.mtime).getFullYear();
    entries.push({
      file: chosen,
      year,
      eventDate,
    });
  }

  // Sort: year desc, then eventDate desc if present
  entries.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    if (a.eventDate && b.eventDate) return new Date(b.eventDate) - new Date(a.eventDate);
    return 0;
  });

  await writeFile(OUT_INDEX, JSON.stringify(entries, null, 2), 'utf-8');
  return entries.length;
}

async function main() {
  const files = await readdir(CR_DIR);
  const candidates = files.filter((f) => isPdf(f) && !isReadable(f));

  // Vérifie la règle de nommage pour les nouveaux PDF non lisibles
  const invalid = candidates.filter((f) => !hasStrictDmyDate(f));
  if (invalid.length > 0) {
    console.error('\n❌ Certains fichiers ne contiennent pas de date au format jj-mm-aaaa :');
    for (const f of invalid) console.error(` - ${f}`);
    console.error('\nMerci de renommer chaque fichier pour inclure une date stricte jj-mm-aaaa.');
    console.error('Exemples :');
    console.error(' - compte-rendu-15-09-2025.pdf');
    console.error(' - pv-du-09-09-2024.pdf');
    console.error('\nEnsuite, relancez la commande : npm run update:CR');
    process.exit(1);
  }

  if (candidates.length === 0) {
    // Même s'il n'y a rien à OCRiser, on nettoie les doublons éventuels
    await cleanupRedundantSources();
    const count = await buildIndex();
    console.log(`Aucun nouveau PDF à OCRiser. L'index a été reconstruit (${count} éléments).`);
    return;
  }

  console.log(`🔎 ${candidates.length} PDF(s) à rendre lisibles détectés. Lancement de l'OCR...`);
  for (const f of candidates) {
    console.log(`📝 OCR en cours : ${f}`);
    await ocrIfNeeded(f);
  }

  await cleanupRedundantSources();
  const count = await buildIndex();
  console.log(`✅ OCR terminé. Index mis à jour (${count} éléments).`);
}

main().catch((err) => {
  console.error('❌ Échec de update-cr-index :', err.message || err);
  process.exit(1);
});
