import { defineStore } from 'pinia'
export const useFavoriteStore = defineStore('favorites', {
  state: () => ({
    favorites: []
    }),
  getters: {
  isFavorite: (state) => (id) => state.favorites.includes(id)},
  actions: {
    toggleFavorite(id) {
      if (this.favorites.includes(id)) {
        this.favorites = this.favorites.filter((f) => f !== id)
      }
      else {
        this.favorites.push(id)
      }
    }
  }
})
