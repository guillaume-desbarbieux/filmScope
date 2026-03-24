<script setup>
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useFilmStore } from '@/stores/filmStore.js'
import FilmCard from '@/components/FilmCard.vue'
import { computed } from 'vue'

const favorites = useFavoriteStore()
const films = useFilmStore().films

const favoriteFilms = computed(() => films.filter((film) => favorites.isFavorite(film.id)))
</script>

<template>
  <h1>My Favorites</h1>
  <FilmCard
    v-for="film in favoriteFilms"
    :key="film.id"
    :film="film"
  />

  <div v-if="favoriteFilms.length === 0">No favorite films yet.</div>
</template>
