<script setup>
import { computed, ref } from 'vue'
import FilmCard from '@/components/FilmCard.vue'
import SearchBar from '@/components/SearchBar.vue'
const appTitle = ref('FilmScope')
const films = ref([
  {
    id: 1,
    title: 'A New Hope',
    year: 2000,
    poster_url: 'https://placehold.co/300x100/orange/white?text=A+new+hope',
    rating: 5.3,
    isFavorite: false,
  },
  {
    id: 2,
    title: 'The Empire Strikes Back',
    year: 2001,
    poster_url: 'https://placehold.co/300x100/orange/white?text=The+empire+strikes+back',
    rating: 8.2,
    isFavorite: false,
  },
  {
    id: 3,
    title: 'Return of the Jedi',
    year: 2003,
    poster_url: 'https://placehold.co/300x100/orange/white?text=Return+of+the+Jedi',
    rating: 7.8,
    isFavorite: false,
  },
])
const searchQuery = ref('')
const filteredFilms = computed(() => {
  return films.value.filter((film) =>
    film.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function toggleFavorite(film) {
  const target = films.value.find(f => f.id === film.id)
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
