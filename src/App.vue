<script setup>
import { computed, ref } from 'vue'
const appTitle = ref('FilmScope')
const appDescription = 'A simple film scope app'
const films = ref([
  {
    id: 1,
    title: 'A New Hope',
    year: 2000,
    poster_url: 'https://placehold.co/300x100/orange/white?text=A+new+hope',
  },
  {
    id: 2,
    title: 'The Empire Strikes Back',
    year: 2001,
    poster_url: 'https://placehold.co/300x100/orange/white?text=The+empire+strikes+back',
  },
  {
    id: 3,
    title: 'Return of the Jedi',
    year: 2003,
    poster_url: 'https://placehold.co/300x100/orange/white?text=Return+of+the+Jedi',
  },
])
const searchQuery = ref('')
const filteredFilms = computed(() => {
  return films.value.filter((film) =>
    film.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})
</script>

<template>
  <header>
    <h1>{{ appTitle }}</h1>
    <p>{{ appDescription }}</p>
  </header>
  <main>
    <input type="text" placeholder="Search films..." v-model="searchQuery" />

    <p>Results : {{ filteredFilms.length }}</p>
    <div v-if="filteredFilms.length > 0">
      <div v-for="film in filteredFilms" :key="film.id">
        <h2>{{ film.title }}</h2>
        <p>{{ film.year }}</p>
        <img :src="film.poster_url" :alt="film.title" />
      </div>
    </div>
    <div v-else>
      <p>No films found.</p>
    </div>
  </main>
</template>

<style scoped></style>
