import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFavoriteStore = defineStore('favorites', () => {
  const favorites = ref([])

  function isFavorite(id) {
    return favorites.value.includes(id)
  }

  function toggleFavorite(id) {
    isFavorite(id)
      ? (favorites.value = favorites.value.filter((f) => f !== id))
      : favorites.value.push(id)
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
