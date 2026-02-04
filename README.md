# Site Web - Hiromu Arakawa

Un site web interactif présentant la vie et l'œuvre d'Hiromu Arakawa, créatrice de Fullmetal Alchemist.

## 🎮 Fonctionnalités

- **5 sections narratives** avec progression déblocable
- **Mini-jeux interactifs** : puzzle, quiz, cercle de transmutation, matching game
- **Certificat personnalisé** d'Alchimiste d'État à la fin du parcours
- **Design steampunk/1930s** inspiré de l'univers FMA
- **Responsive** et accessible

## 📁 Structure du Projet

```
hiromu-arakawa/
├── index.html              # Page principale
├── css/
│   ├── variables.css       # Variables personnalisables
│   ├── base.css            # Styles de base
│   ├── components.css      # Composants UI
│   ├── sections.css        # Styles des sections
│   └── animations.css      # Animations
├── js/
│   ├── utils.js            # Fonctions utilitaires
│   ├── games.js            # Logique des mini-jeux
│   └── main.js             # Application principale
└── assets/
    └── images/             # Vos images (à ajouter)
```

## 🎨 Ajouter vos Assets

Le code contient des placeholders commentés pour vos images. Recherchez les commentaires `<!-- ASSET: ... -->` dans le HTML et les commentaires dans le CSS.

### Images à préparer :

1. **Avatar vache à lunettes** (`cow-avatar.png`)
   - L'avatar iconique d'Arakawa
   - Utilisé dans la section 1 et le puzzle

2. **Paysage Hokkaido** (`hokkaido-farm.jpg`)
   - Pour la section "La Terre"

3. **Couvertures manga** :
   - `silver-spoon.jpg`
   - `arslan.jpg`
   - `tsugai.jpg`
   - `nobles-paysans.jpg`

4. **Éléments décoratifs** :
   - `gear.svg` - Roue crantée steampunk
   - `transmutation-circle.svg` - Cercle alchimique
   - `alchemy-symbols/` - Symboles pour le jeu

### Comment ajouter une image :

1. Placez l'image dans `assets/images/`
2. Trouvez le placeholder dans le HTML
3. Décommentez la balise `<img>` et mettez le bon chemin

## 🚀 Déploiement sur GitHub Pages

1. Créez un nouveau repository sur GitHub
2. Uploadez tous les fichiers
3. Allez dans **Settings > Pages**
4. Sélectionnez **Source: Deploy from a branch**
5. Choisissez **Branch: main** et **/ (root)**
6. Cliquez **Save**

Votre site sera accessible à : `https://votre-username.github.io/nom-du-repo/`

## ⚙️ Personnalisation

### Modifier les couleurs

Éditez `css/variables.css` :

```css
:root {
  --color-red: #B80000;      /* Rouge sang */
  --color-blue: #70CBFF;     /* Bleu électrique */
  --color-gold: #DBB448;     /* Or/Jaune */
  --color-gray: #8E8E8D;     /* Gris métal */
  --color-black: #201919;    /* Noir de fond */
}
```

### Modifier les questions des quiz

Éditez `js/games.js` et modifiez les tableaux `questions` dans :
- `Games.quizTerre.questions`
- `Games.finalQuiz.questions`

### Réinitialiser la progression

Ouvrez la console du navigateur (F12) et tapez :
```javascript
App.resetProgress()
```

## 📱 Compatibilité

- Chrome, Firefox, Safari, Edge (versions récentes)
- Mobile et tablette (responsive)
- Préfère les mouvements réduits respecté

## 📄 Licence

Projet éducatif - BUT MMI

---

*« Si tu ne travailles pas, tu ne manges pas. »* — Famille Arakawa
