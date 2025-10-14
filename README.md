# MCCP - Site de la Liste Citoyenne et Participative

Site web du **Mouvement Citoyen des Communes de Putanges** (MCCP), une liste citoyenne et participative pour les élections municipales de 2026 à Putanges-le-Lac.

## Stack Technique

- **Framework** : [Astro](https://astro.build/)
- **Composants interactifs** : [Svelte](https://svelte.dev/)
- **Charts** : [Chart.js](https://www.chartjs.org/)
- **Styling** : CSS natif avec variables CSS
- **Hébergement** : Vercel + GitHub, le déploiement est automatique à chaque changement de la branche main.

## Pourquoi Astro + Svelte 5 et pas WordPress comme tout le monde ?

**Excellente performance** : Astro génère des sites statiques ultra-rapides (scores Lighthouse proches de 100/100), essentiel pour toucher tous les habitants, même avec une connexion limitée en zone rurale.

**Sécurité maximale** : Pas de base de données, pas de plugins vulnérables, pas de mises à jour de sécurité constantes. Le site est "figé" en HTML/CSS/JS, impossible à pirater.

**Coût zéro** : Hébergement gratuit sur Vercel, pas de frais d'hébergement ou de plugins premium.

**Contrôle total** : Nous avons complètement la main sur le design du site afin qu'il s'adapte à notre identité mais aussi à tous les équipements : mobiles, tablettes et ordinateurs.

**Simplicité de maintenance** : Alice est la maintenante officielle, mais ce guide est conçu pour que n'importe qui puisse reprendre la main si nécessaire.

**Déploiement automatique** : Chaque modification sur GitHub se déploie automatiquement en 2 minutes. Plus de FTP, plus de sauvegarde manuelle.

---

## Tronc commun : Vérifier en local et publier

Cette section s'applique aussi bien pour l'ajout d'articles que pour l'ajout de comptes-rendus (CR).

### Vérifier en local (optionnel mais recommandé)

1. **Installez les dépendances** (première fois seulement) :

```bash
npm install
```

2. **Lancez le serveur de développement** :

```bash
npm run dev
```

3. **Ouvrez votre navigateur** : http://localhost:4321

   - Pour un article : naviguez dans la section "Actualités" et ouvrez l'article.
   - Pour un CR : allez sur la page "Conseils municipaux", vérifiez que le nouveau CR apparaît, qu'il s'ouvre dans le viewer et qu'il est téléchargeable.

4. **Vérifiez que tout est correct** :

   - ✅ Titre et description
   - ✅ Images bien affichées
   - ✅ Formatage du texte
   - ✅ Responsive sur mobile (redimensionnez la fenêtre)

5. **Arrêtez le serveur** quand vous avez fini :
   - Appuyez sur `Ctrl + C` dans le terminal

### Publier vos modifications

#### Option 1 : Modification directe (le plus simple)

**Prérequis** : Compte GitHub + droits d'écriture sur le dépôt

1. **Allez sur** : https://github.com/Alice-Po/MCCP
2. **Cliquez** sur le fichier à modifier ou "Add file" → "Create new file"
3. **Éditez** directement dans l'interface GitHub
4. **Commitez** avec un message descriptif (ex: "Ajout article 15 septembre" ou "Ajout CR 15-09-2025")
5. **Attendez** 2-3 minutes que le site se mette à jour automatiquement

#### Option 2 : Pull Request avec Git (recommandé pour les gros changements)

**Prérequis** :

- Compte GitHub
- Git installé sur votre ordinateur

**Étape 1 : Cloner le projet en local**

1. **Ouvrez un terminal** (Terminal sur Mac, PowerShell sur Windows, Terminal sur Linux)
2. **Naviguez** vers le dossier où vous voulez sauvegarder le projet :
   ```bash
   cd ~/Documents  # ou le dossier de votre choix
   ```
3. **Clonez le projet** :
   ```bash
   git clone https://github.com/Alice-Po/MCCP.git
   cd MCCP
   ```

**Étape 2 : Créer une branche avec votre nom**

```bash
git checkout -b votre-nom
```

Exemple : `git checkout -b marie`

**Étape 3 : Faire vos modifications**

Suivez les instructions spécifiques pour ajouter un article ou un CR (voir sections ci-dessous).

**Étape 4 : Vérifier en local**

Reportez-vous à la section "Vérifier en local" ci-dessus.

**Étape 5 : Sauvegarder et envoyer**

1. **Ajoutez vos fichiers** :

   ```bash
   git add .
   ```

2. **Commitez** avec un message :

   ```bash
   git commit -m "Ajout article 15 septembre par Marie"
   ```

3. **Poussez** vers GitHub :
   ```bash
   git push origin votre-nom
   ```

**Étape 6 : Créer la Pull Request**

1. **Allez sur** : https://github.com/Alice-Po/MCCP
2. **Cliquez** sur "Compare & pull request" (bannière jaune)
3. **Titre** : "Ajout article 15 septembre par Marie"
4. **Description** : Décrivez brièvement votre modification
5. **Cliquez** sur "Create pull request"

**Étape 7 : Attendre la validation**

- Un mainteneur va **réviser** votre travail
- Il peut demander des **modifications** (commentaires)
- Une fois validé, il **fusionne** votre travail
- Le site se met à jour **automatiquement**

---

## Ajouter un article

### Structure des fichiers

```
src/data/blog/          ← Vos articles vont ici
public/assets/img/      ← Vos images vont ici
```

### Créer un nouvel article

1. **Créez un fichier** dans le dossier `src/data/blog/`
2. **Nommez-le** : `VotreTitre.md` (ex: `15Septembre2025.md`)
3. **Copiez ce modèle** et adaptez-le :

```markdown
---
title: 'Votre titre d\'article'
description: 'Description courte de l\'article (2-3 phrases)'
pubDate: 2025-09-15
author: 'MCCP'
image: '/assets/img/votre-image.jpg'
tags: ['actualite', 'reunion']
draft: false
---

Votre contenu en markdown ici...

## Titre de section

Vous pouvez utiliser **gras**, _italique_, [liens](https://example.com)

### Sous-titre

- Listes à puces
- Autres éléments

![Description de l'image](/assets/img/votre-image.jpg)
```

### Ajouter des images

1. **Placez vos images** dans le dossier `public/assets/img/`
2. **Nommez-les** simplement : `mon-image.jpg`
3. **Dans l'article**, utilisez : `![Description](/assets/img/mon-image.jpg)`

**Formats acceptés** : `.jpg`, `.jpeg`, `.png`, `.gif`

### Format des dates

- **Format** : `YYYY-MM-DD` (ex: `2025-09-15`)
- **Date de publication** : Date de l'événement ou de rédaction

### 💡 Astuce : Mettre un article en brouillon

Si vous voulez **sauvegarder votre travail** sans le publier immédiatement :

1. **Dans les métadonnées** de votre article, changez :

   ```markdown
   draft: false
   ```

   en :

   ```markdown
   draft: true
   ```

2. **Commitez** avec un message comme "Brouillon article 15 septembre"
3. **L'article n'apparaîtra pas** sur le site public
4. **Pour le publier plus tard** : changez `draft: true` en `draft: false` et commitez

---

## Ajouter un événement (agenda)

Cette section explique comment ajouter un événement à l'agenda (réunions publiques, événements citoyens, etc.).

### 1) Structure des fichiers

```
src/data/agenda/              ← Fichiers markdown des événements
public/assets/img/agenda/     ← Images et flyers (JPG, PNG, PDF)
public/assets/vcalendar/      ← Fichiers .ics pour l'ajout au calendrier
```

### 2) Créer un nouvel événement

1. **Créez un fichier** dans `src/data/agenda/`
2. **Nommez-le** au format `YYYYMMDD.md` (ex: `20251011.md` pour le 11 octobre 2025)
3. **Copiez ce modèle** et adaptez-le :

```markdown
---
title: 'Réunion publique à Chênedouit'
description: 'Des envies, des idées, des propositions pour notre commune ? Discutons-en !'
date: 2025-10-11
place: 'Salle des fêtes de Chênedouit'
start: 09-30
end: 12-00
author: 'MCCP'
facebook: 'https://fb.me/e/9oM4G6Vbn'
image: '/assets/img/agenda/flyer-chenouit-10112025.jpg'
flyers: '/assets/img/agenda/flyersx4-chendouit-10112025.pdf'
vcalendar: '/assets/vcalendar/2025-10-11-reunion-publique-a-chenedouit.ics'
tags: ['reunion']
draft: false
---
```

**Explications des champs** :

- `title` : Titre de l'événement
- `description` : Description courte (1-2 phrases)
- `date` : Date de l'événement au format `YYYY-MM-DD`
- `place` : Lieu de l'événement (ou "à venir" si non défini)
- `start` : Heure de début au format `HH-MM` (ex: `09-30` pour 9h30)
- `end` : Heure de fin au format `HH-MM`
- `author` : Auteur (généralement `MCCP`)
- `facebook` : Lien vers l'événement Facebook (ou `''` si absent)
- `image` : Chemin vers l'image de l'événement (JPG/PNG)
- `flyers` : Chemin vers le flyer PDF imprimable (ou `null` si absent)
- `vcalendar` : Chemin vers le fichier `.ics` pour ajout au calendrier
- `tags` : Liste de tags (ex: `['reunion', 'citoyenne']`)
- `draft` : `false` pour publier, `true` pour masquer

### 3) Ajouter les fichiers associés

**Image de l'événement** :

1. Placez votre image dans `public/assets/img/agenda/`
2. Nommez-la de façon descriptive : `flyer-lieu-DDMMYYYY.jpg`
3. Dans le markdown, référencez-la : `image: '/assets/img/agenda/flyer-lieu-DDMMYYYY.jpg'`

**Flyer PDF imprimable** (optionnel) :

1. Placez votre PDF dans `public/assets/img/agenda/`
2. Nommez-le : `flyersx4-lieu-DDMMYYYY.pdf` (format 4 flyers par page pour impression)
3. Dans le markdown, référencez-le : `flyers: '/assets/img/agenda/flyersx4-lieu-DDMMYYYY.pdf'`
4. Si pas de flyer, mettez : `flyers: null`

**Fichier vCalendar (.ics)** :

1. Créez un fichier `.ics` dans `public/assets/vcalendar/`
2. Nommez-le : `YYYY-MM-DD-titre-court.ics` (ex: `2025-10-11-reunion-publique-a-chenedouit.ics`)
3. Contenu exemple :

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MCCP//Agenda//FR
BEGIN:VEVENT
UID:20251011-chenedouit@mccp.fr
DTSTAMP:20251001T120000Z
DTSTART:20251011T093000
DTEND:20251011T120000
SUMMARY:Réunion publique à Chênedouit
DESCRIPTION:Des envies, des idées, des propositions pour notre commune ? Discutons-en !
LOCATION:Salle des fêtes de Chênedouit
END:VEVENT
END:VCALENDAR
```

4. Dans le markdown, référencez-le : `vcalendar: '/assets/vcalendar/2025-10-11-reunion-publique-a-chenedouit.ics'`

### 4) Vérifier et publier

Reportez-vous à la section "Tronc commun : Vérifier en local et publier" ci-dessus.

Sur le site, l'événement apparaîtra sur la page d'accueil et dans la section Agenda. Les visiteurs pourront télécharger le flyer et ajouter l'événement à leur calendrier.

---

## Ajouter un compte-rendu municipal (CR)

Cette section explique, pas à pas, comment ajouter un nouveau compte-rendu municipal (PDF) pour qu'il soit consultable et recherchable (OCR) sur le site.

### 1) Où déposer le fichier

Placez votre PDF dans le dossier suivant :

```
public/assets/datas/CR-municipaux/
```

### 2) Règle de nommage (obligatoire)

- Le nom du fichier doit contenir une date au format strict `jj-mm-aaaa` (ex: `15-09-2025`).
- Exemples de noms valides :

```
compte-rendu-15-09-2025.pdf
pv-du-09-09-2024-signe.pdf
```

- Le script refusera tout fichier sans date `jj-mm-aaaa` et vous indiquera quel fichier renommer.

### 3) Lancer le script d'OCR et mise à jour de l'index

Le site maintient un index JSON des CR pour l'affichage et le tri.

**Commande à lancer** :

```bash
npm run update:CR
```

**Ce que fait le script** :

- Détecte les PDF qui n'ont pas encore de version lisible (`*_readable.pdf`)
- Applique un traitement OCR pour permettre la recherche (Ctrl+F) dans le document
- Supprime le PDF original non lisible une fois la version lisible créée
- Reconstruit l'index `public/assets/datas/ocr_index.json` avec un format simple :

```json
[{ "file": "compte-rendu-15-09-2025_readable.pdf", "year": 2025, "eventDate": "2025-09-15" }]
```

- Le chemin complet est reconstruit côté interface (le site affiche `/assets/datas/CR-municipaux/${file}`)

**Pré-requis (si nécessaire)** :

```bash
sudo apt update
sudo apt install ocrmypdf jbig2enc
```

### 4) Vérifier et publier

Reportez-vous à la section "Tronc commun : Vérifier en local et publier" ci-dessus.

Quand tout est bon, commit/push comme d'habitude. Le déploiement Vercel se fera automatiquement.

---

## Support et Contact

En cas de problème technique, contactez Alice.
