<script setup>
import { ref, watch, computed } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import {
  getFilmDetails,
  getRecommendationsFromFavorites,
  MOVIE_GENRES,
} from '@/services/tmdbService.js'
import FilmGrid from '@/components/FilmGrid.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const films = ref([])
const isLoading = ref(false)
const suggestions = ref([])
const isSuggestionsLoading = ref(false)
const topGenreNames = ref([])
const error = ref(null)

// Films favoris déjà chargés → leurs IDs pour exclure des suggestions
const favoriteIds = computed(() => favoriteStore.favorites)

async function loadFavorites(ids) {
  if (ids.length === 0) {
    films.value = []
    return
  }
  isLoading.value = true
  try {
    films.value = await Promise.all(ids.map((id) => getFilmDetails(id)))
  } catch (err) {
    error.value = err
    films.value = []
  } finally {
    isLoading.value = false
  }
}

async function loadSuggestions(ids) {
  isSuggestionsLoading.value = true
  try {
    const raw = await getRecommendationsFromFavorites(ids)

    // Exclure les films déjà en favoris
    const filtered = raw.filter((f) => !ids.includes(f.id))
    suggestions.value = filtered.slice(0, 20)

    // Calculer les genres dominants pour le label
    if (ids.length > 0 && films.value.length > 0) {
      const genreCount = {}
      films.value.forEach((film) => {
        film.genre_ids?.forEach((id) => {
          genreCount[id] = (genreCount[id] || 0) + 1
        })
      })
      const topIds = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([id]) => Number(id))
      topGenreNames.value = topIds
        .map((id) => MOVIE_GENRES.find((g) => g.id === id)?.name)
        .filter(Boolean)
    }
  } catch (error) {
    console.error('Erreur suggestions :', error)
    suggestions.value = []
  } finally {
    isSuggestionsLoading.value = false
  }
}

// Surveille les favoris pour recharger en temps réel
watch(
  () => [...favoriteStore.favorites],
  async (ids) => {
    await loadFavorites(ids)
    await loadSuggestions(ids)
  },
  { immediate: true },
)

const suggestionLabel = computed(() => {
  if (topGenreNames.value.length > 0)
    return `Parce que vous aimez ${topGenreNames.value.join(' & ')}`
  return 'Suggestions populaires'
})

function goToDetail(f) {
  const type = f.media_type === 'tv' ? 'tv' : 'film'
  router.push(`/${type}/${f.id}`)
}
</script>

<template>
  <main>
    <!-- Favoris -->
    <div class="section">
      <h1>Mes films favoris</h1>
      <div v-if="isLoading" class="state-msg">Chargement...</div>
      <div v-else-if="films.length === 0" class="state-msg">Vous n'avez pas encore de favori.</div>
      <template v-else>
        <p class="subtitle">
          <template v-if="films.length === 1">Votre seul et unique favori</template>
          <template v-else
            >Vous avez {{ films.length }} favori{{ films.length !== 1 ? 's' : '' }} !</template
          >
        </p>
        <div class="films-list">
          <FilmGrid
            :films="films"
            :isLoading="isLoading"
            :error="error"
            @clickFilm="goToDetail($event)"
          />
        </div>
      </template>
    </div>

    <!-- Suggestions intelligentes -->
    <div class="section">
      <h1>{{ suggestionLabel }}</h1>
      <p v-if="favoriteIds.length > 0 && topGenreNames.length > 0" class="subtitle">
        Sélection basée sur vos {{ favoriteIds.length }} favori{{
          favoriteIds.length !== 1 ? 's' : ''
        }}
      </p>
      <div v-if="isSuggestionsLoading" class="state-msg">Chargement des suggestions...</div>
      <div v-else-if="suggestions.length === 0 && !isSuggestionsLoading" class="state-msg">
        Aucune suggestion disponible.
      </div>
      <div v-else class="films-list">
        <FilmGrid
          :films="suggestions"
          :isLoading="isSuggestionsLoading"
          @clickFilm="goToDetail($event)"
        />
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
