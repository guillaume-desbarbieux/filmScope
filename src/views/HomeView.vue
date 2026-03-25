<script setup>
import { onMounted, ref } from 'vue'
import FilmCard from '@/components/FilmCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import { getPopularFilms, searchFilms, discoverMedia } from '@/services/tmdbService'

const films = ref([])
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const hasActiveFilters = ref(false)
const resultsLabel = ref('')

async function load(fetchFn) {
  isLoading.value = true
  error.value = null
  try {
    films.value = await fetchFn()
  } catch (err) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}

async function search({ query, mediaType, genreIds, decade, language, minRating }) {
  searchQuery.value = query
  const isFiltered = mediaType || genreIds?.length > 0 || decade || language || minRating !== null
  hasActiveFilters.value = isFiltered

  if (query) {
    // Recherche textuelle → /search/multi (ignore les filtres discover)
    await load(() => searchFilms(query))
    resultsLabel.value = `${films.value.length} résultat${films.value.length !== 1 ? 's' : ''} pour « ${query} »`
  } else if (isFiltered) {
    // Filtres sans texte → /discover
    await load(() =>
      discoverMedia({
        mediaType: mediaType || 'movie',
        genreIds: genreIds || [],
        decade,
        language,
        minRating,
      }),
    )
    resultsLabel.value = `${films.value.length} résultat${films.value.length !== 1 ? 's' : ''} avec vos filtres`
  } else {
    // Aucun filtre → populaires
    await load(getPopularFilms)
    resultsLabel.value = `${films.value.length} films populaires`
  }
}

onMounted(async () => {
  await load(getPopularFilms)
  resultsLabel.value = `${films.value.length} films populaires`
})
</script>

<template>
  <main>
    <div class="toolbar">
      <SearchBar @search="search" />
      <span class="results-count">{{ resultsLabel }}</span>
    </div>

    <div v-if="isLoading" class="state-msg">Chargement...</div>
    <div v-else-if="error" class="state-msg error">Erreur de chargement.</div>
    <div v-else-if="films.length === 0" class="state-msg">
      <template v-if="searchQuery">Aucun résultat pour « {{ searchQuery }} »</template>
      <template v-else>Aucun résultat avec ces filtres.</template>
    </div>

    <div v-else class="films-list">
      <FilmCard v-for="film in films" :key="film.id" :film="film" />
    </div>
  </main>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.results-count {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-muted);
  white-space: nowrap;
}
</style>
