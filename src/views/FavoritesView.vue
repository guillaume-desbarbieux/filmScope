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
  <div v-if="favoriteFilms.length === 0">No favorite films yet.</div>
  <div v-else-if="favoriteFilms.length === 1">1 favorite film</div>
  <div v-else>{{ favoriteFilms.length }} favorites films</div>
  <div class="films-list">
  <FilmCard v-for="film in favoriteFilms" :key="film.id" :film="film" />
  </div>
</template>

<style scoped>
.films-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 0 2rem 2rem;
}
</style>
