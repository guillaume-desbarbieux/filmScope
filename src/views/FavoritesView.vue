<script setup>
import { onMounted, ref } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import FilmCard from '@/components/FilmCard.vue'
import { getFilmDetails } from '@/services/tmdbService.js'

const favoriteStore = useFavoriteStore()
const films = ref([])
const isLoading = ref(false)

onMounted(async() => {
  if (favoriteStore.favorites.length === 0) return
  isLoading.value = true

  try {
  films.value = await Promise.all(favoriteStore.favorites.map(id => getFilmDetails(id)))
    } catch (error) {
    console.error('Erreur lors du chargement des films favoris:', error)
    films.value = []
    } finally {
    isLoading.value = false
    }
})
</script>

<template>
  <div v-if="films.length === 0">Vous n'avez pas encore de favori.</div>
  <div v-else-if="films.length === 1">Votre seul et unique favori</div>
  <div v-else> Vous avez {{ films.length }} favoris !</div>
  <div class="films-list">
    <FilmCard v-for="film in films" :key="film.id" :film="film" />
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
