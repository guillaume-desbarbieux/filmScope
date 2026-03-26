# FilmScope

Application web de découverte de films et séries, construite avec Vue 3 et l'API TMDB.

## Stack

- **Vue 3** avec `<script setup>` et Composition API
- **Pinia** pour la gestion des favoris
- **Vue Router** en mode hash
- **Axios** pour les appels API
- **TMDB API** comme source de données

## Prérequis

- Node.js 18+
- Une clé API TMDB ([obtenir une clé](https://www.themoviedb.org/settings/api))

## Installation

```bash
npm install
```

Créer un fichier `.env` à la racine :

```env
VITE_TMDB_API_KEY=ta_clé_api
```

## Développement

```bash
npm run dev
```

## Production

```bash
npm run build
```

## Fonctionnalités

### Deux modes de navigation

**Recherche** — recherche textuelle via `/search/multi`, couvrant films et séries simultanément.

**Découvrir** — exploration par filtres via `/discover` : type (film / série), genre, décennie, langue originale, note minimale.

Les deux modes sont distincts et ne se mélangent pas. Switcher de l'un à l'autre conserve les saisies sans les soumettre.

### Tri

Disponible dans les deux modes : pertinence (ordre API), note, année, titre.

### Fiche détail

Chaque film ou série dispose d'une page dédiée avec : titre, tagline, genres, année, durée, note, synopsis, budget, recettes, langue, pays de production, et une sélection de titres similaires.

### Favoris

Ajout / suppression depuis la fiche détail ou la grille. Les favoris sont persistés en `localStorage` et consultables sur une page dédiée, avec recommandations générées à partir des genres les plus présents dans la sélection.

### Thème

Bascule clair / sombre, persistée en `localStorage`.

## Structure

```
src/
├── components/
│   ├── AppNavbar.vue      # Navigation + toggle thème
│   ├── SearchBar.vue      # Segmented control Recherche / Découvrir
│   ├── FilmCard.vue       # Carte film / série
│   └── FilmGrid.vue       # Grille avec états chargement / erreur / vide
├── views/
│   ├── HomeView.vue       # Page principale
│   ├── FilmDetailView.vue # Fiche détail (film & série)
│   └── FavoritesView.vue  # Page favoris
├── services/
│   └── tmdbService.js     # Appels TMDB + mapping + constantes filtres
├── stores/
│   └── favoriteStore.js   # Store Pinia favoris
└── router/
    └── index.js           # Routes hash
```

## Variables CSS

Le thème repose sur des variables CSS définies dans `main.css` :

| Variable          | Rôle                         |
|-------------------|------------------------------|
| `--c-bg`          | Fond de page                 |
| `--c-surface`     | Fond des cartes et panneaux  |
| `--c-border`      | Couleur des bordures         |
| `--c-text`        | Texte principal              |
| `--c-muted`       | Texte secondaire             |
| `--c-amber`       | Couleur d'accent             |
| `--c-amber-dim`   | Accent avec transparence     |


## Arbre de Composants
```
App.vue
│
├── AppNavBar.vue
│
└── RouterView 
    │
    ├── HomeView
    │   │
    │   ├── SearchBar
    │   │           =>  props: none
    │   │           <=  emits: @search
    │   │
    │   ├── FilmGrid.vue
    │   │   │       =>  props:  :films, :isLoading, :error, :searchQuery
    │   │   │       <=  emits:  film-click
    │   │   │
    │   │   └── FilmCard.vue
    │   │       │       =>  props:  :film
    │   │       │       <=  emits:  @film-click
    │   │       │
    │   │       └── favoriteStore.js    [Pinia]
    │   │                   <=  export: useFavoriteStore() =>  { favorites, isFavorite(), toggleFavorite(), initStore() }
    │   │
    │   └── tmdbService.js      [axios]
    │               <=  export:  getPopular, getFilmDetails, searchFilms, getSimilarFilms, getBestRatedFilms, discoverMedia, getRecommendationsFromFavorites
    │
    ├── FilmDetailView
    │   │       =>  props:  :mediaType (injecté par le router)
    │   │ 
    │   ├── FilmGrid.vue
    │   ├── tmdbService.js
    │   └── favoriteStore.js
    │
    └── FavoritesView
        ├── FilmGrid.vue
        ├── tmdbService.js
        └── favoriteStore.js
```