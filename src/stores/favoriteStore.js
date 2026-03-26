import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFavoriteStore = defineStore('favorites', () => {
  const favorites = ref([])

  function isFavorite(film) {
    return favorites.value.some((f) => f.id === film.id && f.mediaType === film.mediaType)
  }

  function toggleFavorite(film) {
    isFavorite(film)
      ? (favorites.value = favorites.value.filter((f) => (f.id !== film.id || f.mediaType !== film.mediaType)))
      : favorites.value.push({id:film.id, mediaType:film.mediaType})
    _persist()
  }

  function initStore() {
    const saved = localStorage.getItem('filmscope-favorites')
    if (saved) favorites.value = JSON.parse(saved)
  }

  function _persist() {
    localStorage.setItem('filmscope-favorites', JSON.stringify(favorites.value))
  }

  return { favorites, isFavorite, toggleFavorite, initStore }
})
