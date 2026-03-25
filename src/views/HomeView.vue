<script setup>
import { onMounted, ref } from 'vue'
import FilmCard from '@/components/FilmCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import { getPopularFilms, searchFilms } from '@/services/tmdbService'

const films = ref([])
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')

async function load(fetchFn) {
  isLoading.value = true
  error.value = null
  try {
    films.value = await fetchFn()
  } catch (err) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}

async function search(query) {
  searchQuery.value = query
  query ? await load(() => searchFilms(query)) : await load(getPopularFilms)
}

onMounted(() => load(getPopularFilms))
</script>

<template>
  <main>
    <div class="toolbar">
      <SearchBar @search="search" />
      <span class="results-count">
        <template v-if="searchQuery">
          {{ films.length }} résultat{{ films.length !== 1 ? 's' : '' }} pour « {{ searchQuery }} »
        </template>
        <template v-else> {{ films.length }} films populaires </template>
      </span>
    </div>

    <div v-if="isLoading" class="state-msg">Chargement...</div>
    <div v-else-if="error" class="state-msg error">Erreur de chargement.</div>
    <div v-else-if="films.length === 0" class="state-msg">
      Aucun résultat pour « {{ searchQuery }} »
    </div>

    <div v-else class="films-list">
      <FilmCard v-for="film in films" :key="film.id" :film="film" />
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
