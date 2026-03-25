<script setup>
import { onMounted, ref, watch } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import FilmCard from '@/components/FilmCard.vue'
import { getFilmDetails, getBestRatedFilms } from '@/services/tmdbService.js'

const favoriteStore = useFavoriteStore()
const films = ref([])
const isLoading = ref(false)
const bestRatedFilms = ref([])

async function loadFavorites(ids) {
  if (ids.length === 0) {
    films.value = []
    return
  }
  isLoading.value = true
  try {
    films.value = await Promise.all(ids.map((id) => getFilmDetails(id)))
  } catch (error) {
    console.error('Erreur lors du chargement des films favoris :', error)
    films.value = []
  } finally {
    isLoading.value = false
  }
}

watch(
  () => [...favoriteStore.favorites],
  (ids) => loadFavorites(ids),
  { immediate: true },
)

onMounted(async () => {
  try {
    bestRatedFilms.value = await getBestRatedFilms()
  } catch (error) {
    console.error('Erreur lors du chargement des films les mieux notés :', error)
    bestRatedFilms.value = []
  }
})
</script>

<template>
  <main>
    <div class="section">
      <h1>Mes films favoris</h1>
      <div v-if="films.length === 0" class="state-msg">Vous n'avez pas encore de favori.</div>
      <template v-else>
        <p class="subtitle">
          <template v-if="films.length === 1">Votre seul et unique favori</template>
          <template v-else>Vous avez {{ films.length }} favoris !</template>
        </p>
      </template>
      <div class="films-list">
        <FilmCard v-for="film in films" :key="film.id" :film="film" />
      </div>
    </div>

    <div class="section">
      <h1>D'autres suggestions</h1>
      <div class="films-list">
        <FilmCard v-for="film in bestRatedFilms" :key="film.id" :film="film" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.section {
  margin-bottom: 3rem;
}

.subtitle {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-muted);
  margin-bottom: 1.25rem;
}
</style>
