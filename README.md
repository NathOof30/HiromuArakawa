# L'Alchimie du Reel - Projet MMI

Projet web narratif et interactif realise dans le cadre du BUT MMI.
Le site met en scene la vie et l'oeuvre de Hiromu Arakawa avec une progression par sections, des mini-jeux et une logique de deblocage.

## Presentation du projet

Objectif pedagogique : concevoir une experience web complete qui combine narration, direction artistique, interactions JavaScript et integration front-end.

Le parcours est structure en 5 sections :
1. L'Atelier
2. La Terre
3. Le Metal
4. Multivers
5. L'Heritage

Chaque section contient du contenu editorial et/ou un mini-jeu permettant de debloquer la suite du parcours.

## Fonctionnalites principales

- Navigation guidee avec sections verrouillees/deverrouillees
- Barre de progression laterale
- Mini-jeux interactifs : puzzle, quiz, cercle de transmutation, matching
- Quiz final + certificat personnalise
- Univers visuel inspire de Fullmetal Alchemist

## Structure du projet

```
hiromu-arakawa/
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   ├── sections.css
│   └── animations.css
├── js/
│   ├── utils.js
│   ├── games.js
│   └── main.js
└── assets/
    └── images/
```

## Lancer le projet

Projet statique : ouvrez simplement index.html dans un navigateur.

Pour un rendu plus fiable (paths, cache, assets), utilisez de preference un serveur local.

## Reset de la progression

Si vous voulez recommencer le parcours depuis le debut :
1. Ouvrez les outils developpeur du navigateur (F12)
2. Allez dans l'onglet Console
3. Executez la commande suivante :

```javascript
App.resetProgress()
```

Cela efface la progression stockee et recharge l'etat initial du site.

## Notes

- Projet educatif MMI
- Les contenus et visuels sont utilises dans un cadre pedagogique
