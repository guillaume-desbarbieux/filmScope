import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
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
    title: film.title || film.name || 'Titre inconnu',
    year:
      film.release_date || film.first_air_date
        ? new Date(film.release_date || film.first_air_date).getFullYear()
        : '--',
    poster_url: film.poster_path
      ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${film.poster_path}`
      : null,
    rating: film.vote_average,
    overview: film.overview,
    media_type: film.media_type || (film.title ? 'movie' : 'tv'),
    genre_ids: film.genre_ids ?? [],
  }
}

function mapFilmDetails(film) {
  return {
    ...mapFilm(film),
    tagline: film.tagline || null,
    release_date: film.release_date || null,
    runtime: film.runtime || null,
    genres: film.genres?.map((g) => g.name) ?? [],
    genre_ids: film.genres?.map((g) => g.id) ?? [],
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
  const { data } = await api.get('/movie/popular')
  return data.results.map(mapFilm)
}

export async function getFilmDetails(id, mediaType = 'movie') {
  const endpoint = mediaType === 'tv' ? `/tv/${id}` : `/movie/${id}`
  const { data } = await api.get(endpoint)
  return mapFilmDetails({ ...data, media_type: mediaType })
}

export async function searchFilms(query) {
  const { data } = await api.get('/search/multi', { params: { query } })
  return data.results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv').map(mapFilm)
}

export async function getSimilarFilms(id, mediaType = 'movie') {
  const endpoint = mediaType === 'tv' ? `/tv/${id}/similar` : `/movie/${id}/similar`
  const { data } = await api.get(endpoint)
  return data.results.map((r) => mapFilm({ ...r, media_type: mediaType }))
}

export async function getBestRatedFilms() {
  const { data } = await api.get('/movie/top_rated')
  return data.results.map(mapFilm)
}

export const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Famille' },
  { id: 14, name: 'Fantastique' },
  { id: 27, name: 'Horreur' },
  { id: 9648, name: 'Mystère' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science-fiction' },
  { id: 53, name: 'Thriller' },
]

export const TV_GENRES = [
  { id: 10759, name: 'Action & Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Famille' },
  { id: 9648, name: 'Mystère' },
  { id: 10765, name: 'Science-fiction & Fantastique' },
  { id: 10768, name: 'Guerre & Politique' },
]

export const MEDIA_TYPES = [
  { value: 'movie', label: 'Film' },
  { value: 'tv', label: 'Série' },
]

export const DECADES = [
  { value: '1970', label: 'Années 70', from: '1970-01-01', to: '1979-12-31' },
  { value: '1980', label: 'Années 80', from: '1980-01-01', to: '1989-12-31' },
  { value: '1990', label: 'Années 90', from: '1990-01-01', to: '1999-12-31' },
  { value: '2000', label: 'Années 2000', from: '2000-01-01', to: '2009-12-31' },
  { value: '2010', label: 'Années 2010', from: '2010-01-01', to: '2019-12-31' },
  { value: '2020', label: 'Années 2020', from: '2020-01-01', to: '2029-12-31' },
]

export const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'Anglais' },
  { value: 'es', label: 'Espagnol' },
  { value: 'ja', label: 'Japonais' },
  { value: 'ko', label: 'Coréen' },
  { value: 'it', label: 'Italien' },
  { value: 'de', label: 'Allemand' },
]

export const MIN_RATINGS = [
  { value: 7, label: '7+ ★' },
  { value: 7.5, label: '7.5+ ★' },
  { value: 8, label: '8+ ★' },
]

export async function discoverMedia({
  mediaType = 'movie',
  genreIds = [],
  decade = null,
  language = null,
  minRating = null,
} = {}) {
  const params = { sort_by: 'popularity.desc' }

  if (genreIds.length > 0) params.with_genres = genreIds.join(',')
  if (language) params.with_original_language = language
  if (minRating) params['vote_average.gte'] = minRating
  if (decade) {
    const field = mediaType === 'tv' ? 'first_air_date' : 'primary_release_date'
    params[`${field}.gte`] = decade.from
    params[`${field}.lte`] = decade.to
  }

  const endpoint = mediaType === 'tv' ? '/discover/tv' : '/discover/movie'
  const { data } = await api.get(endpoint, { params })
  return data.results.map((r) => mapFilm({ ...r, media_type: mediaType }))
}

export async function getRecommendationsFromFavorites(favoriteIds) {
  if (favoriteIds.length === 0) return getBestRatedFilms()

  const details = await Promise.all(
    favoriteIds.slice(0, 40).map((id) =>
      api
        .get(`/movie/${id}`)
        .then((r) => r.data)
        .catch(() => null),
    ),
  )

  // Comptage fréquence des genres
  const genreCount = {}
  details.filter(Boolean).forEach((film) => {
    film.genres?.forEach(({ id }) => {
      genreCount[id] = (genreCount[id] || 0) + 1
    })
  })

  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => Number(id))

  if (topGenres.length === 0) return getBestRatedFilms()

  const { data } = await api.get('/discover/movie', {
    params: {
      with_genres: topGenres.join(','),
      sort_by: 'vote_average.desc',
      'vote_count.gte': 150,
    },
  })

  return data.results.map(mapFilm)
}
