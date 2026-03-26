<script setup>
import FilmCard from './FilmCard.vue'

const props = defineProps({
  films: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Error,
    default: null,
  },
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['clickFilm'])
</script>

<template>
  <div v-if="props.isLoading" class="state-msg">Chargement...</div>
  <div v-else-if="props.error" class="state-msg error">Erreur de chargement.</div>
  <div v-else-if="props.films.length === 0" class="state-msg">
    <template v-if="props.searchQuery">Aucun résultat pour « {{ props.searchQuery }} »</template>
    <template v-else>Aucun résultat avec ces filtres.</template>
  </div>
  <div v-else class="films-list">
    <FilmCard
      v-for="film in props.films"
      :key="film.id"
      :film="film"
      @clickFilm="emit('clickFilm', $event)"
    />
  </div>
</template>
