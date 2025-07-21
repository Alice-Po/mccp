# Scripts de Conversion CSV → JSON

Ce dossier contient les scripts de conversion de fichiers CSV en format JSON pour le projet MCCP.

## 📁 Structure

```
scripts/
├── README.md                           # Cette documentation
├── convert-budget-csv-to-json.js       # Script de conversion budget
├── convert-comparaison-csv-to-json.js  # Script de conversion comparaison
└── utils/                              # Modules utilitaires partagés
    ├── csv-parser.js                   # Fonctions de parsing CSV
    └── file-utils.js                   # Fonctions de gestion de fichiers
```

## 🎯 Scripts Disponibles

### 1. **convert-budget-csv-to-json.js**

Convertit les fichiers CSV de données budgétaires municipales en JSON.

**Usage :**

```bash
node scripts/convert-budget-csv-to-json.js public/assets/datas/2025/base_budget_2025.csv
```

**Entrée :** CSV avec colonnes budgétaires (DÉPENSES/RECETTES, SECTION, COMPTE, etc.)  
**Sortie :** JSON avec transformation des données (nombres, booléens)

### 2. **convert-comparaison-csv-to-json.js**

Convertit les fichiers CSV de comparaison entre communes en JSON.

**Usage :**

```bash
node scripts/convert-comparaison-csv-to-json.js public/assets/datas/2025/base_comparaison_2025.csv
```

**Entrée :** CSV avec colonnes de comparaison (exercice, département, commune, etc.)  
**Sortie :** JSON avec transformation des données (nombres, booléens)

## ⚙️ Modules Utilitaires

### `utils/csv-parser.js`

Fonctions communes de parsing CSV :

- `parseCSVLine()` - Parse une ligne CSV avec gestion des guillemets
- `mapHeaders()` - Convertit les en-têtes CSV vers clés JSON
- `convertLineToJSON()` - Convertit une ligne en objet JSON
- `cleanNumericValue()` - Nettoie et convertit valeurs monétaires
- `cleanBooleanValue()` - Convertit "oui"/"non" en booléens

### `utils/file-utils.js`

Fonctions communes de gestion de fichiers :

- `validateInputFile()` - Valide l'existence et le format du fichier
- `generateOutputPath()` - Génère le chemin de sortie JSON
- `showHelp()` - Affiche l'aide des scripts

## 🔄 Transformations de Données

### Valeurs Numériques

```
"100 000,50 €" → 100000.5
"- €" → 0
"" → 0
```

### Valeurs Booléennes

```
"oui" → true
"non" → false
"Oui" → true
"Non" → false
```

### En-têtes CSV

```
"regroupement : focale n°1" → "regroupement_focale_n1"
"CHAPITRE (officiel)" → "CHAPITRE_officiel"
```

## 📋 Configuration

Chaque script contient un objet `CONFIG` avec :

- `CSV_SEPARATOR` : Séparateur CSV (`;`)
- `COLUMN_MAPPING` : Mapping en-têtes → clés JSON
- `NUMERIC_FIELDS` : Liste des champs numériques
- `BOOLEAN_FIELDS` : Liste des champs booléens

## 🚀 Utilisation

### Options d'aide

```bash
node scripts/convert-budget-csv-to-json.js --help
node scripts/convert-comparaison-csv-to-json.js --help
```

### Conversion complète

```bash
# Budget
node scripts/convert-budget-csv-to-json.js public/assets/datas/2025/base_budget_2025.csv

# Comparaison
node scripts/convert-comparaison-csv-to-json.js public/assets/datas/2025/base_comparaison_2025.csv
```

Le fichier JSON sera généré dans le même dossier que le CSV source.

## 🔧 Développement

### Ajouter un Nouveau Script

1. **Créer le script** dans `/scripts/`
2. **Importer les utilitaires** :
   ```javascript
   import { parseCSVLine, mapHeaders, convertLineToJSON } from './utils/csv-parser.js';
   import { validateInputFile, generateOutputPath, showHelp } from './utils/file-utils.js';
   ```
3. **Définir la configuration** spécifique (mapping, champs numériques/booléens)
4. **Implémenter la logique** en utilisant les fonctions communes

### Étendre les Utilitaires

- **csv-parser.js** : Ajouter nouvelles transformations de données
- **file-utils.js** : Ajouter nouvelles fonctions de fichiers

## 📊 Exemple de Sortie

### Budget

```json
[
  {
    "DÉPENSES/RECETTES": "DEPENSES",
    "SECTION": "FONCTIONNEMENT",
    "pour_comparaison_prévision_réalisation": true,
    "PREVISIONS_2024": 2400.5,
    "REALISATIONS_2024": 2638.05
  }
]
```

### Comparaison

```json
[
  {
    "exercice": "2023",
    "département": "Calvados",
    "commune_rurale": true,
    "commune_touristique": false,
    "montant": 88368.03,
    "population": 1276
  }
]
```

## ⚠️ Limitations

- Lecture complète en mémoire (fichiers < 100MB recommandés)
- Pas de validation stricte du schéma CSV
- Format de sortie fixe (non configurable)

## 🏗️ Architecture

L'architecture modulaire permet :

- ✅ **Réutilisation** du code entre scripts
- ✅ **Maintenance** simplifiée
- ✅ **Tests** unitaires sur les modules
- ✅ **Extensibilité** pour nouveaux formats

---

_Documentation générée pour le projet MCCP - Mouvement Citoyen des Communes de Putanges-le-Lac_
