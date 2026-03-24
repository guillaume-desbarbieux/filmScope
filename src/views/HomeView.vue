<script setup>
import { computed, ref } from 'vue'
import {useFilmStore} from '@/stores/filmStore'
import FilmCard from '@/components/FilmCard.vue'
import SearchBar from '@/components/SearchBar.vue'

const films = useFilmStore().films
const appTitle = ref('FilmScope')
const searchQuery = ref('')


const filteredFilms = computed(() => {
  return films.filter((film) =>
    film.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function toggleFavorite(film) {
  const target = films.find((f) => f.id === film.id)
  if (target) {
    target.isFavorite = !target.isFavorite
  }
}
</script>

<template>
  <header>
    <h1>{{ appTitle }}</h1>
  </header>
  <main>
    <SearchBar v-model="searchQuery" />
    <p>Results : {{ filteredFilms.length }} films</p>
    <FilmCard
      v-for="film in filteredFilms"
      :key="film.id"
      :film="film"
      @toggleFavorite="toggleFavorite"
    />
    <div v-if="filteredFilms.length === 0">
      <p>No films found for "{{ searchQuery }}"</p>
    </div>
  </main>
</template>

<style scoped></style>
