<script setup>
import { ref, computed, watch } from 'vue'
import {
  MOVIE_GENRES,
  TV_GENRES,
  MEDIA_TYPES,
  DECADES,
  LANGUAGES,
  MIN_RATINGS,
} from '@/services/tmdbService'

const emit = defineEmits(['search'])

// Mode : 'search' | 'discover'
const mode = ref('search')

const query = ref('')

const selectedMediaType = ref(null)
const selectedGenreIds = ref([])
const selectedDecade = ref(null)
const selectedLanguage = ref(null)
const selectedMinRating = ref(null)
const selectedSort = ref(null)

let debounceTimer = null

const availableGenres = computed(() =>
  selectedMediaType.value === 'tv' ? TV_GENRES : MOVIE_GENRES,
)

const hasActiveFilters = computed(
  () =>
    !!selectedMediaType.value ||
    selectedGenreIds.value.length > 0 ||
    !!selectedDecade.value ||
    !!selectedLanguage.value ||
    selectedMinRating.value != null,
)

const activeFilterCount = computed(() => {
  let count = 0
  if (selectedMediaType.value) count++
  if (selectedGenreIds.value.length > 0) count++
  if (selectedDecade.value) count++
  if (selectedLanguage.value) count++
  if (selectedMinRating.value != null) count++
  return count
})

function setMode(m) {
  mode.value = m
  emitSearch()
}

function onInput(value) {
  query.value = value
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => emitSearch(), 400)
}

function resetQuery() {
  query.value = ''
  clearTimeout(debounceTimer)
  emitSearch()
}

function resetFilters() {
  selectedMediaType.value = null
  selectedGenreIds.value = []
  selectedDecade.value = null
  selectedLanguage.value = null
  selectedMinRating.value = null
  emitSearch()
}

function toggleGenre(id) {
  const idx = selectedGenreIds.value.indexOf(id)
  if (idx === -1) selectedGenreIds.value.push(id)
  else selectedGenreIds.value.splice(idx, 1)
  emitSearch()
}

function setMediaType(val) {
  selectedMediaType.value = selectedMediaType.value === val ? null : val
  selectedGenreIds.value = []
  emitSearch()
}

function emitSearch() {
  if (mode.value === 'search') {
    emit('search', {
      query: query.value.trim(),
      sort: selectedSort.value,
    })
  } else {
    emit('search', {
      query: '',
      mediaType: selectedMediaType.value,
      genreIds: selectedGenreIds.value,
      decade: selectedDecade.value ? DECADES.find((d) => d.value === selectedDecade.value) : null,
      language: selectedLanguage.value,
      minRating: selectedMinRating.value,
      sort: selectedSort.value,
    })
  }
}

watch([selectedDecade, selectedLanguage, selectedMinRating], () => {
  if (mode.value === 'discover') emitSearch()
})
</script>

<template>
  <div class="search-root">
    <!-- Segmented control -->
    <div class="mode-toggle">
      <button
        class="mode-btn"
        :class="{ 'mode-btn--active': mode === 'search' }"
        @click="setMode('search')"
      >
        <span class="mode-icon">⌕</span> Recherche
      </button>
      <button
        class="mode-btn"
        :class="{ 'mode-btn--active': mode === 'discover' }"
        @click="setMode('discover')"
      >
        <span class="mode-icon">⊞</span> Découvrir
        <span v-if="activeFilterCount > 0 && mode === 'discover'" class="filter-badge">
          {{ activeFilterCount }}
        </span>
      </button>
    </div>

    <!-- Mode Recherche -->
    <transition name="panel-fade" mode="out-in">
      <div
        v-if="mode === 'search'"
        key="search"
        class="search-bar"
        :class="{ active: query.length > 0 }"
      >
        <input
          type="search"
          :value="query"
          placeholder="Rechercher un film, une série..."
          @input="onInput($event.target.value)"
        />
        <button v-if="query.length > 0" class="reset-btn" @click="resetQuery">Effacer</button>
      </div>

      <!-- Mode Découvrir -->
      <div v-else key="discover" class="filters-panel">
        <!-- Type -->
        <div class="filter-group">
          <span class="filter-label">Type</span>
          <div class="chip-row">
            <button
              v-for="mt in MEDIA_TYPES"
              :key="mt.value"
              class="chip"
              :class="{ 'chip--active': selectedMediaType === mt.value }"
              @click="setMediaType(mt.value)"
            >
              {{ mt.label }}
            </button>
          </div>
        </div>

        <!-- Genres -->
        <div class="filter-group">
          <span class="filter-label">Genre</span>
          <div class="chip-row chip-row--wrap">
            <button
              v-for="g in availableGenres"
              :key="g.id"
              class="chip"
              :class="{ 'chip--active': selectedGenreIds.includes(g.id) }"
              @click="toggleGenre(g.id)"
            >
              {{ g.name }}
            </button>
          </div>
        </div>

        <!-- Décennie -->
        <div class="filter-group">
          <span class="filter-label">Décennie</span>
          <div class="chip-row">
            <button
              v-for="d in DECADES"
              :key="d.value"
              class="chip"
              :class="{ 'chip--active': selectedDecade === d.value }"
              @click="selectedDecade = selectedDecade === d.value ? null : d.value"
            >
              {{ d.label }}
            </button>
          </div>
        </div>

        <!-- Langue + Note min -->
        <div class="filter-row">
          <div class="filter-group">
            <span class="filter-label">Langue originale</span>
            <select v-model="selectedLanguage" class="filter-select">
              <option :value="null">Toutes</option>
              <option v-for="l in LANGUAGES" :key="l.value" :value="l.value">{{ l.label }}</option>
            </select>
          </div>
          <div class="filter-group">
            <span class="filter-label">Note minimale</span>
            <select v-model="selectedMinRating" class="filter-select">
              <option :value="null">Toutes</option>
              <option v-for="r in MIN_RATINGS" :key="r.value" :value="r.value">
                {{ r.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Footer filtres -->
        <div class="filter-footer">
          <button v-if="hasActiveFilters" class="btn-reset-filters" @click="resetFilters">
            ✕ Réinitialiser
          </button>
        </div>
      </div>
    </transition>

    <!-- Tri (commun aux deux modes) -->
    <div class="sort-row">
      <span class="filter-label">Trier par</span>
      <div class="chip-row">
        <button
          v-for="s in [
            { value: null, label: 'Pertinence' },
            { value: 'rating', label: 'Note' },
            { value: 'year', label: 'Année' },
            { value: 'title', label: 'Titre' },
          ]"
          :key="String(s.value)"
          class="chip"
          :class="{ 'chip--active': selectedSort === s.value }"
          @click="
            selectedSort = s.value;
            emitSearch()
          "
        >
          {{ s.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-root {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 700px;
  width: 100%;
}

/* Segmented control */
.mode-toggle {
  display: flex;
  background: var(--c-surface);
  border: 0.5px solid var(--c-border);
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}
.mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--c-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 10px 0;
  cursor: pointer;
  transition:
    color 0.2s,
    background 0.2s;
}
.mode-btn + .mode-btn {
  border-left: 0.5px solid var(--c-border);
}
.mode-btn:hover {
  color: var(--c-text);
  background: rgba(255, 255, 255, 0.03);
}
.mode-btn--active {
  color: var(--c-amber);
  background: var(--c-amber-dim);
}
.mode-icon {
  font-size: 14px;
}
.filter-badge {
  background: var(--c-amber);
  color: #0d0d0f;
  font-size: 0.6rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Barre de recherche */
.search-bar {
  display: flex;
  align-items: center;
  background: var(--c-surface);
  border: 0.5px solid var(--c-border);
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.search-bar.active,
.search-bar:focus-within {
  border-color: rgba(232, 160, 48, 0.5);
}
input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--c-text);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  padding: 11px 14px;
  caret-color: var(--c-amber);
  min-width: 0;
}
input::placeholder {
  color: var(--c-muted);
}
.reset-btn {
  background: none;
  border: none;
  border-left: 0.5px solid var(--c-border);
  color: var(--c-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0 14px;
  min-height: 42px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 0.2s,
    background 0.2s;
}
.reset-btn:hover {
  color: var(--c-text);
  background: rgba(255, 255, 255, 0.04);
}

/* Panneau filtres */
.filters-panel {
  background: var(--c-surface);
  border: 0.5px solid var(--c-border);
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 1rem 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.filter-label {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-muted);
}
.chip-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 2px;
}
.chip-row--wrap {
  flex-wrap: wrap;
}
.chip-row::-webkit-scrollbar {
  height: 3px;
}
.chip-row::-webkit-scrollbar-track {
  background: transparent;
}
.chip-row::-webkit-scrollbar-thumb {
  background: var(--c-border);
  border-radius: 2px;
}
.chip {
  background: none;
  border: 0.5px solid var(--c-border);
  border-radius: 20px;
  color: var(--c-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  padding: 4px 11px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;
  flex-shrink: 0;
}
.chip:hover {
  border-color: rgba(232, 160, 48, 0.4);
  color: var(--c-text);
}
.chip--active {
  border-color: var(--c-amber);
  color: var(--c-amber);
  background: var(--c-amber-dim);
}
.filter-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.filter-row .filter-group {
  flex: 1;
  min-width: 140px;
}
.filter-select {
  background: var(--c-bg);
  border: 0.5px solid var(--c-border);
  border-radius: 6px;
  color: var(--c-text);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  padding: 6px 10px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}
.filter-select:focus {
  border-color: rgba(232, 160, 48, 0.5);
}
.filter-select option {
  background: var(--c-surface);
}
.filter-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.1rem;
}
.btn-reset-filters {
  background: none;
  border: none;
  color: var(--c-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: color 0.2s;
  padding: 4px 0;
}
.btn-reset-filters:hover {
  color: #e05a5a;
}

/* Tri */
.sort-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.6rem;
}

/* Transition */
.panel-fade-enter-active,
.panel-fade-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
