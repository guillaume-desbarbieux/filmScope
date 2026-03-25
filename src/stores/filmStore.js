import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const apiKey = import.meta.env.VITE_TMDB_API_KEY

export const useFilmStore = defineStore('films', () => {
  const films = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchPopularFilms() {
    isLoading.value = true
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
      films.value = response.data.results.map((film) => ({
        id: film.id,
        title: film.title,
        year: new Date(film.release_date).getFullYear(),
        poster_url: `https://image.tmdb.org/t/p/w300${film.poster_path}`,
        rating: film.vote_average,
        overview: film.overview,
      }))
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }
return { films, isLoading, error, fetchPopularFilms }
})
