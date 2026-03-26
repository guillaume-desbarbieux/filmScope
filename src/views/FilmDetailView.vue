<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { getFilmDetails, getSimilarFilms } from '@/services/tmdbService.js'
import FilmGrid from '@/components/FilmGrid.vue'

const props = defineProps({
  mediaType: {
    type: String,
    default: 'movie',
  },
})

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()
const film = ref(null)
const isLoading = ref(false)
const error = ref(null)
const similarFilms = ref([])

// Formatters
const releaseFormatted = computed(() => {
  if (!film.value?.release_date) return null
  return new Date(film.value.release_date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const runtimeFormatted = computed(() => {
  const min = film.value?.runtime
  if (!min) return null
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ''}` : `${m}min`
})

const ratingFormatted = computed(() => {
  const r = film.value?.rating
  return r != null ? r.toFixed(1) : null
})

const tmdbLink = computed(() => {
  if (!film.value) return null
  const type = props.mediaType === 'tv' ? 'tv' : 'movie'
  return `https://www.themoviedb.org/${type}/${film.value.id}`
})

function formatMoney(n) {
  if (!n) return null
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

async function loadFilm(id) {
  isLoading.value = true
  error.value = null
  film.value = null
  similarFilms.value = []
  try {
    const [filmData, similarData] = await Promise.all([
      getFilmDetails(id, props.mediaType),
      getSimilarFilms(id, props.mediaType),
    ])
    film.value = filmData
    similarFilms.value = similarData
  } catch (e) {
    error.value = e
  } finally {
    isLoading.value = false
  }
}

function toggleFavorite() {
  favoriteStore.toggleFavorite(film.value.id)
}

watch(
  () => route.params.id,
  (id) => loadFilm(id),
  { immediate: true },
)

function goToDetail(f) {
  const type = f.media_type === 'tv' ? 'tv' : 'film'
  router.push(`/${type}/${f.id}`)
}
</script>

<template>
  <main>
    <div class="film-detail">
      <button class="back-btn" @click="router.back()">← Retour</button>

      <div v-if="isLoading" class="state-msg">Chargement...</div>
      <div v-else-if="error" class="state-msg error">Erreur de chargement.</div>

      <div v-if="film" class="detail-layout">
        <div class="poster">
          <img :src="film.poster_url_lg || film.poster_url" :alt="film.title" />
        </div>

        <div class="info">
          <h1>{{ film.title }}</h1>
          <p v-if="film.tagline" class="tagline">« {{ film.tagline }} »</p>

          <div class="badges">
            <span v-if="ratingFormatted" class="badge badge-amber">★ {{ ratingFormatted }}</span>
            <span v-if="film.vote_count" class="badge badge-outline"
              >{{ film.vote_count }} votes</span
            >
            <span v-if="releaseFormatted" class="badge badge-outline">{{ releaseFormatted }}</span>
            <span v-if="runtimeFormatted" class="badge badge-outline">
              ⏱ {{ runtimeFormatted }}</span
            >
          </div>

          <div v-if="film.genres.length" class="genres">
            <span v-for="genre in film.genres" :key="genre" class="genre-pill">{{ genre }}</span>
          </div>

          <p class="overview">{{ film.overview || 'Aucun synopsis disponible.' }}</p>

          <dl class="meta-table">
            <template v-if="film.spoken_languages.length">
              <dt>Langues</dt>
              <dd>{{ film.spoken_languages.join(', ') }}</dd>
            </template>
            <template v-if="film.production_countries.length">
              <dt>Pays</dt>
              <dd>{{ film.production_countries.join(', ') }}</dd>
            </template>
            <template v-if="formatMoney(film.budget)">
              <dt>Budget</dt>
              <dd>{{ formatMoney(film.budget) }}</dd>
            </template>
            <template v-if="formatMoney(film.revenue)">
              <dt>Recettes</dt>
              <dd>{{ formatMoney(film.revenue) }}</dd>
            </template>
          </dl>

          <div class="actions">
            <a v-if="film.homepage" class="btn-primary" :href="film.homepage" target="_blank">
              Site officiel ↗
            </a>
            <a class="btn-primary" :href="tmdbLink" target="_blank"> Voir sur TMDB ↗ </a>
            <button class="btn-secondary" @click="toggleFavorite">
              {{ favoriteStore.isFavorite(film.id) ? '❤️ Retirer' : '♡ Favoris' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="similar-section">
      <h2>Films similaires</h2>
      <div v-if="isLoading" class="state-msg">Chargement...</div>
      <div v-else-if="similarFilms.length === 0" class="state-msg">Aucun film similaire.</div>
      <div v-else class="films-list">
        <FilmGrid :films="similarFilms" :isLoading="isLoading" @clickFilm="goToDetail($event)" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.film-detail {
  padding: 2rem;
  max-width: 920px;
}
.detail-layout {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
}

.poster {
  width: 220px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 0.5px solid var(--c-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
.poster img {
  width: 100%;
  display: block;
}

.info {
  flex: 1;
  min-width: 0;
}

.tagline {
  font-size: 0.82rem;
  font-style: italic;
  color: var(--c-muted);
  margin-bottom: 1rem;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 1.25rem;
}
.genre-pill {
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: 0.5px solid var(--c-amber);
  color: var(--c-amber);
  border-radius: 20px;
  padding: 3px 10px;
}

.overview {
  font-size: 0.88rem;
  line-height: 1.8;
  color: var(--c-muted);
  margin-bottom: 2rem;
  max-width: 520px;
}

.meta-table {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.35rem 1.25rem;
  margin-bottom: 1.75rem;
  font-size: 0.8rem;
}
.meta-table dt {
  color: var(--c-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}
.meta-table dd {
  color: var(--c-text);
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.similar-section {
  padding: 0 2rem;
}
.similar-section h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  margin-bottom: 1.25rem;
}
</style>
