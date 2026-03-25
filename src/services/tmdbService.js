import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'fr-FR',
  },
})

api.interceptors.request.use((config) => {
  console.log(`[TMDB] ${config.method.toUpperCase()} ${config.url}`)
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const messages = {
      401: 'Clé API invalide ou manquante',
      404: 'Ressource introuvable',
      429: 'Trop de requêtes - limite TMDB atteinte',
      500: 'Erreur serveur',
      503: 'Service indisponible',
    }
    console.error(`[TMDB] ${status} ${messages[status] ?? error.message}`)
    return Promise.reject(error)
  },
)

function mapFilm(film) {
  return {
    id: film.id,
    title: film.title,
    year: film.release_date ? new Date(film.release_date).getFullYear() : '--',
    poster_url: film.poster_path ? `https://image.tmdb.org/t/p/w300${film.poster_path}` : null,
    rating: film.vote_average,
    overview: film.overview,
  }
}

function mapFilmDetails(film) {
  return{
    ...mapFilm(film),
    tagline: film.tagline || null,
    release_date: film.release_date || null,
    runtime: film.runtime || null,
    genres: film.genres?.map((g) => g.name) ?? [],
    vote_count: film.vote_count ?? null,
    budget: film.budget || null,
    revenue: film.revenue || null,
    original_language: film.original_language || null,
    spoken_languages: film.spoken_languages?.map((l) => l.name) ?? [],
    production_countries: film.production_countries?.map((c) => c.name) ?? [],
    homepage: film.homepage || null,
    poster_url_lg: film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : null,

  }
}
export async function getPopularFilms() {
  const {data} = await api.get('/movie/popular')
  return data.results.map(mapFilm)
}

export async function getFilmDetails(id) {
  const {data} = await api.get(`/movie/${id}`)
  return mapFilmDetails(data)
}

export async function searchFilms(query) {
  const {data} = await api.get('/search/movie', {params: {query}})
  return data.results.map(mapFilm)
}

export async function getSimilarFilms(id) {
  const {data} = await api.get(`/movie/${id}/similar`)
  return data.results.map(mapFilm)
}

export async function getBestRatedFilms() {
  const {data} = await api.get('/movie/top_rated')
  return data.results.map(mapFilm)
}
