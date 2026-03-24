import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoriteStore = defineStore('favorites', () => {
  const favorites = ref([])

  const isFavorite = (id) => favorites.value.includes(id)

  function toggleFavorite(id) {
    if (favorites.value.includes(id)) {
      favorites.value = favorites.value.filter((f) => f !== id)
    } else {
      favorites.value.push(id)
    }
  }

  return { favorites, isFavorite, toggleFavorite }
})
