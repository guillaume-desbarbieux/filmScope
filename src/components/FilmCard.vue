<script setup>
import { defineProps } from 'vue'
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
function goToDetails() {
  router.push(`/films/${props.film.id}`)
}
</script>

<template>
  <div class="film-card">
    <img :src="film.poster_url" :alt="film.title" />
    <h2>{{ film.title }} ({{ film.year }})</h2>
    <p>{{ film.rating }}</p>
    <button @click="toggleFavorite">{{ film.isFavorite ? '❤️' : '🤍' }}</button>
    <button @click="goToDetails">Details</button>
  </div>
</template>

<style scoped>
.film-card {
  text-align: center;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
}
img {
  width: 150px;
  height: 220px;
  display: block;
  margin: 0 auto 10px;
}
</style>
