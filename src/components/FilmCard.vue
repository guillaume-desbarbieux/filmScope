<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
  film: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['toggleFavorite'])
const router = useRouter()

function toggleFavorite() {
  emit('toggleFavorite', props.film)
}
function goToDetail() {
  router.push(`/film/${props.film.id}`)
}
</script>

<template>
  <div class="film-card">
    <img :src="film.poster_url" :alt="film.title" />
    <h2>{{ film.title }} ({{ film.year }})</h2>
    <p>{{ film.rating }}</p>
    <button @click="toggleFavorite">{{ film.isFavorite ? '❤️' : '🤍' }}</button>
    <button @click="goToDetail">Details</button>
  </div>
</template>

<style scoped></style>
