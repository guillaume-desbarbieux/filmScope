<script setup>
import { onMounted, ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import { getPopularFilms, searchFilms, discoverMedia } from '@/services/tmdbService'
import FilmGrid from '@/components/FilmGrid.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
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

async function search({ query, mediaType, genreIds, decade, language, minRating, sort }) {
  searchQuery.value = query
  hasActiveFilters.value =
    mediaType !== null ||
    genreIds?.length > 0 ||
    decade !== null ||
    language !== null ||
    minRating !== null

  if (query) {
    // Recherche textuelle → /search/multi (ignore les filtres discover)
    await load(() => searchFilms(query))
    resultsLabel.value = `${films.value.length} résultat${films.value.length !== 1 ? 's' : ''} pour « ${query} »`
  } else if (hasActiveFilters.value) {
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

  films.value.sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating
    if (sort === 'year') return b.year - a.year
    if (sort === 'title') return a.title.localeCompare(b.title)
    return 0
  })
}

onMounted(async () => {
  await load(getPopularFilms)
  resultsLabel.value = `${films.value.length} films populaires`
})

function goToDetail(f) {
  const type = f.media_type === 'tv' ? 'tv' : 'film'
  router.push(`/${type}/${f.id}`)
}
</script>

<template>
  <main>
    <div class="toolbar">
      <SearchBar @search="search" />
      <span class="results-count">{{ resultsLabel }}</span>
    </div>
    <FilmGrid
      :films="films"
      :isLoading="isLoading"
      :error="error"
      :searchQuery="searchQuery"
      @clickFilm="goToDetail($event)"
    />
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
