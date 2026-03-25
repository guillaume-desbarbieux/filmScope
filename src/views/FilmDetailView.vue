<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import {getFilmDetails} from '@/services/tmdbService.js'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()
const film = ref(null)

function toggleFavorite() {
  favoriteStore.toggleFavorite(film.value.id)
}

onMounted(() => getFilmDetails(route.params.id).then(data => film.value = data))
</script>

<template>
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
</template>

<style scoped>
.film-detail {
  padding: 2rem;
  max-width: 860px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 0.5px solid var(--c-border);
  border-radius: 6px;
  color: var(--c-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 14px;
  cursor: pointer;
  margin-bottom: 2rem;
  transition:
    border-color 0.2s,
    color 0.2s;
}
.back-btn:hover {
  border-color: var(--c-amber);
  color: var(--c-text);
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
h1 {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.badge {
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 20px;
  padding: 3px 10px;
}
.badge-amber {
  background: var(--c-amber-dim);
  color: var(--c-amber);
}
.badge-outline {
  border: 0.5px solid var(--c-border);
  color: var(--c-muted);
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
.btn-primary {
  background: var(--c-amber);
  color: #0d0d0f;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 8px 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s;
}
.btn-primary:hover {
  opacity: 0.85;
}
.btn-secondary {
  background: none;
  border: 0.5px solid var(--c-border);
  border-radius: 6px;
  color: var(--c-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 8px 20px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s;
}
.btn-secondary:hover {
  border-color: var(--c-amber);
  color: var(--c-text);
}
</style>
