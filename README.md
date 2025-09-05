# MCCP - Site de la Liste Citoyenne et Participative

Site web du **Mouvement Citoyen des Communes de Putanges** (MCCP), une liste citoyenne et participative pour les élections municipales de 2026 à Putanges-le-Lac.

## Stack Technique

- **Framework** : [Astro](https://astro.build/)
- **Composants spécifiques à la finance** : [Svelte](https://svelte.dev/) +**Charts** : [Chart.js](https://www.chartjs.org/)
- **Styling** : CSS natif avec variables CSS
- **Hébergement** : Vercel + github, le déploiement est automatique à chaque changementè de la branche main.

## Comment ajouter un article

> **Pourquoi Astro + Svelte 5 et pas WordPress comme tout le monde ?**
>
> **Excellente performance** : Astro génère des sites statiques ultra-rapides (scores Lighthouse proches de 100/100), essentiel pour toucher tous les habitants, même avec une connexion limitée en zone rurale.
>
> **Sécurité maximale** : Pas de base de données, pas de plugins vulnérables, pas de mises à jour de sécurité constantes. Le site est "figé" en HTML/CSS/JS, impossible à pirater.
>
> **Coût zéro** : Hébergement gratuit sur Vercel, pas de frais d'hébergement ou de plugins premium.
>
> **Contrôle total** : Nous avons complétement la main sur le design du site afin qui s'adapte à notre identité mais aussi à tous les équipements : mobiles, tablettes et ordinateurs.
>
> **Simplicité de maintenance** : Alice est la maintenante officielle, mais ce guide est conçu pour que n'importe qui puisse reprendre la main si nécessaire.
>
> **⚡ Déploiement automatique** : Chaque modification sur GitHub se déploie automatiquement en 2 minutes. Plus de FTP, plus de sauvegarde manuelle.

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

## Publier vos modifications

### Option 1 : Modification directe (le plus simple)

**Prérequis** : Compte GitHub + droits d'écriture sur le dépôt

1. **Allez sur** : https://github.com/Alice-Po/MCCP
2. **Cliquez** sur le fichier à modifier ou "Add file" → "Create new file"
3. **Éditez** directement dans l'interface GitHub
4. **Commitez** avec un message comme "Ajout article 15 septembre"
5. **Attendez** 2-3 minutes que le site se mette à jour automatiquement

#### 💡 Astuce : Mettre un article en brouillon

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

### Option 2 : Pull Request avec Git (recommandé pour les gros changements)

**Prérequis** :

- Compte GitHub
- Git installé sur votre ordinateur

#### Étape 1 : Cloner le projet en local

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

#### Étape 2 : Créer une branche avec votre nom

1. **Créez une branche** avec votre nom :
   ```bash
   git checkout -b votre-nom
   ```
   Exemple : `git checkout -b marie`

#### Étape 3 : Ajouter votre article

1. **Créez le fichier** de votre article :

   ```bash
   # Sur Mac/Linux
   touch src/data/blog/15Septembre2025.md

   # Sur Windows
   echo. > src/data/blog/15Septembre2025.md
   ```

2. **Ouvrez le fichier** dans votre éditeur préféré :

   - **VS Code** : `code src/data/blog/15Septembre2025.md`
   - **Notepad++** : `notepad++ src/data/blog/15Septembre2025.md`
   - **Vim** : `vim src/data/blog/15Septembre2025.md`
   - **Ou double-cliquez** sur le fichier dans l'explorateur

3. **Écrivez votre article** en utilisant le modèle ci-dessus

#### Étape 4 : Ajouter vos images

1. **Copiez vos images** dans le dossier :

   ```bash
   # Copiez vos images dans public/assets/img/
   cp /chemin/vers/votre/image.jpg public/assets/img/
   ```

2. **Ou glissez-déposez** vos images dans le dossier `public/assets/img/` avec l'explorateur

#### Étape 5 : Visualiser votre article en local (optionnel mais recommandé)

1. **Installez les dépendances** (première fois seulement) :

   ```bash
   npm install
   ```

2. **Lancez le serveur de développement** :

   ```bash
   npm run dev
   ```

3. **Ouvrez votre navigateur** et allez sur : http://localhost:4321

4. **Naviguez vers votre article** :

   - Allez dans la section "Actualités" du site
   - Votre article devrait apparaître dans la liste
   - Cliquez dessus pour le voir en entier

5. **Vérifiez que tout est correct** :

   - ✅ Titre et description
   - ✅ Images bien affichées
   - ✅ Formatage du texte
   - ✅ Responsive sur mobile (redimensionnez la fenêtre)

6. **Arrêtez le serveur** quand vous avez fini :
   - Appuyez sur `Ctrl + C` dans le terminal

#### Étape 6 : Sauvegarder et envoyer

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

#### Étape 7 : Créer la Pull Request

1. **Allez sur** : https://github.com/Alice-Po/MCCP
2. **Cliquez** sur "Compare & pull request" (bannière jaune)
3. **Titre** : "Ajout article 15 septembre par Marie"
4. **Description** : Décrivez brièvement votre article
5. **Cliquez** sur "Create pull request"

#### Étape 8 : Attendre la validation

- Un mainteneur va **réviser** votre article
- Il peut demander des **modifications** (commentaires)
- Une fois validé, il **fusionne** votre travail
- Le site se met à jour **automatiquement**

## Support et Contact

En cas de problème technique, contactez Alice
