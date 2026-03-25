<script setup>
import { computed, onMounted, ref } from 'vue'
import { useFilmStore } from '@/stores/filmStore'
import FilmCard from '@/components/FilmCard.vue'
import SearchBar from '@/components/SearchBar.vue'

const filmStore = useFilmStore()
const searchQuery = ref('')

const filteredFilms = computed(() => {
  return filmStore.films.filter((film) =>
    film.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

onMounted(() => {
  filmStore.fetchPopularFilms()
})
</script>

<template>
  <main>
    <div class="toolbar">
      <SearchBar v-model="searchQuery" />
      <span class="results-count">
        <template v-if="searchQuery">
          {{ filteredFilms.length }} résultat{{ filteredFilms.length !== 1 ? 's' : '' }} pour «
          {{ searchQuery }} »
        </template>
        <template v-else> {{ filteredFilms.length }} films populaires </template>
      </span>
    </div>

    <div v-if="filmStore.isLoading" class="state-msg">Chargement...</div>
    <div v-else-if="filmStore.error" class="state-msg error">Erreur de chargement.</div>
    <div v-else-if="filteredFilms.length === 0" class="state-msg">
      Aucun film trouvé pour « {{ searchQuery }} »
    </div>

    <div v-else class="films-list">
      <FilmCard v-for="film in filteredFilms" :key="film.id" :film="film" />
    </div>
  </main>
</template>

<style scoped>
.films-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 0 2rem 2rem;
}

main {
  padding: 2rem;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.results-count {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-muted);
  white-space: nowrap;
}
.state-msg {
  font-size: 0.88rem;
  color: var(--c-muted);
  padding: 3rem 0;
  text-align: center;
}
.state-msg.error {
  color: #e05a5a;
}
</style>
