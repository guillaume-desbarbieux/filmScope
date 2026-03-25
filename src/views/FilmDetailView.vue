<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { getFilmDetails, getSimilarFilms } from '@/services/tmdbService.js'
import FilmCard from '@/components/FilmCard.vue'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()
const film = ref(null)
const isLoading = ref(false)
const error = ref(null)
const similarFilms = ref([])

async function loadFilm(id) {
  isLoading.value = true
  error.value = null
  film.value = null
  similarFilms.value = []
  try {
    const [filmData, similarData] = await Promise.all([getFilmDetails(id), getSimilarFilms(id)])
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
</script>

<template>
  <main>
    <div class="film-detail">
      <button class="back-btn" @click="router.back()">← Retour</button>

      <div v-if="film" class="detail-layout">
        <div class="poster">
          <img :src="film.poster_url" :alt="film.title" />
        </div>

        <div class="info">
          <h1>{{ film.title }}</h1>
          <div class="badges">
            <span class="badge badge-amber">★ {{ film.rating }}</span>
            <span class="badge badge-outline">{{ film.year }}</span>
          </div>
          <p class="overview">{{ film.overview }}</p>
          <div class="actions">
            <a
              class="btn-primary"
              :href="`https://www.themoviedb.org/movie/${film.id}`"
              target="_blank"
            >
              Voir sur TMDB ↗
            </a>
            <button class="btn-secondary" @click="toggleFavorite">
              {{ favoriteStore.isFavorite(film.id) ? '❤️ Retirer' : '♡ Favoris' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="similar-films">
      <h2>Films similaires</h2>
      <div v-if="isLoading" class="state-msg">Chargement...</div>
      <div v-else-if="error" class="state-msg error">Erreur de chargement.</div>
      <div v-else-if="similarFilms.length === 0" class="state-msg">Aucun film similaire »</div>

      <div v-else class="films-list">
        <FilmCard v-for="film in similarFilms" :key="film.id" :film="film" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.film-detail {
  padding: 2rem;
  max-width: 860px;
}
.detail-layout {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
}

.poster {
  width: 200px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 0.5px solid var(--c-border);
}
.poster img {
  width: 100%;
  display: block;
}

.info {
  flex: 1;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.overview {
  font-size: 0.88rem;
  line-height: 1.75;
  color: var(--c-muted);
  margin-bottom: 2rem;
  max-width: 520px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
