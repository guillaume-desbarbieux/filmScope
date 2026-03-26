<script setup>
import { useFavoriteStore } from '@/stores/favoriteStore.js'
const favoriteStore = useFavoriteStore()
const props = defineProps({
  film: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['film-click'])

function toggleFavorite() {
  favoriteStore.toggleFavorite(props.film.id)
}

const ratingFormatted = (r) => {
  return r != null ? r.toFixed(1) : null
}

function emitClick(f) {
  emit('film-click', {
    id: f.id,
    media_type: f.media_type,
  })
}
</script>

<template>
  <div class="film-card" @click="emitClick(film)">
    <div class="poster-wrap">
      <img :src="film.poster_url" :alt="film.title" />
      <button class="fav-btn" @click.stop="toggleFavorite">
        {{ favoriteStore.isFavorite(film.id) ? '❤️' : '🤍' }}
      </button>
    </div>
    <div class="card-body">
      <h2>{{ film.title }}</h2>
      <div class="meta">
        <span class="year">{{ film.year }}</span>
        <span class="rating">★ {{ ratingFormatted(film.rating) }}</span>
        <span class="media">{{ film.media_type }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.film-card {
  background: var(--c-surface);
  border: 0.5px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  width: 160px;
  flex-shrink: 0;
  transition:
    border-color 0.25s,
    transform 0.2s;
}
.film-card:hover {
  border-color: rgba(232, 160, 48, 0.4);
  transform: translateY(-3px);
}

.poster-wrap {
  position: relative;
}
img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
}
.fav-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(13, 13, 15, 0.7);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.fav-btn:hover {
  background: rgba(13, 13, 15, 0.95);
}

.card-body {
  padding: 0.65rem 0.75rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
h2 {
  font-family: 'Playfair Display', serif;
  font-size: 0.85rem;
  line-height: 1.3;
}
.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.year {
  font-size: 0.7rem;
  color: var(--c-muted);
}
.rating {
  font-size: 0.7rem;
  background: var(--c-amber-dim);
  color: var(--c-amber);
  padding: 2px 7px;
  border-radius: 20px;
}

.media {
  font-size: 0.65rem;
  color: var(--c-muted);
}
</style>
