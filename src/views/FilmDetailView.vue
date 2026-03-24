<template>
  <div class="film-detail">
    <button @click="router.back()">Back</button>
    <div v-if="film">
      <h1>{{ film.title }}</h1>
      <p>{{ film.overview }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useFilmStore } from '@/stores/filmStore'

const route = useRoute()
const router = useRouter()

const films = useFilmStore().films

const film = ref(null)

onMounted(() => {
  const id = Number(route.params.id)
  film.value = films.find((f) => f.id === id) ?? null
})
</script>
