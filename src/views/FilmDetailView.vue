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

const route = useRoute()
const router = useRouter()

const films = [
  {
    id: 1,
    title: 'A New Hope',
    year: 2000,
    poster_url: 'https://placehold.co/300x100/orange/white?text=A+new+hope',
    rating: 5.3,
    isFavorite: false,
  },
  {
    id: 2,
    title: 'The Empire Strikes Back',
    year: 2001,
    poster_url: 'https://placehold.co/300x100/orange/white?text=The+empire+strikes+back',
    rating: 8.2,
    isFavorite: false,
  },
  {
    id: 3,
    title: 'Return of the Jedi',
    year: 2003,
    poster_url: 'https://placehold.co/300x100/orange/white?text=Return+of+the+Jedi',
    rating: 7.8,
    isFavorite: false,
  },
]

const film = ref(null)

onMounted(() => {
  const id = Number(route.params.id)
  film.value = films.find((f) => f.id === id) ?? null
})
</script>
