import { ref, computed } from 'vue'
import { movies as initialMovies, type Movie, type Genre, type Person } from '@/data/movies'

const STORAGE_KEY = 'kinoteka.data.v1'

function safeParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

const persisted =
  typeof localStorage !== 'undefined'
    ? safeParse<Movie[]>(localStorage.getItem(STORAGE_KEY) || '')
    : null
const state = ref<Movie[]>(Array.isArray(persisted) && persisted.length ? persisted : initialMovies)

function save() {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
}

// Merge newly added default movies if user has an older persisted dataset
if (Array.isArray(persisted) && persisted.length) {
  const missing = initialMovies.filter((m) => !state.value.some((x) => x.id === m.id))
  if (missing.length) {
    state.value = [...state.value, ...missing]
    save()
  }
}

export function useDataStore() {
  const allGenres = computed<Genre[]>(() => {
    const set = new Set<Genre>()
    state.value.forEach((m) => m.genres.forEach((g) => set.add(g)))
    return Array.from(set)
  })

  const allActors = computed<Person[]>(() => {
    const set = new Set<string>()
    state.value.forEach((m) => m.cast.forEach((a) => set.add(a.name)))
    return Array.from(set).map((name) => ({ id: name, name }))
  })

  function setMovies(arr: Movie[]) {
    state.value = [...arr]
    save()
  }

  function addMovie(movie: Movie) {
    if (state.value.some((m) => m.id === movie.id)) {
      throw new Error('ID уже используется')
    }
    state.value.push(movie)
    save()
  }

  function updateMovie(id: string, patch: Partial<Movie>) {
    const idx = state.value.findIndex((m) => m.id === id)
    if (idx === -1) throw new Error('Фильм не найден')
    state.value[idx] = { ...state.value[idx], ...patch }
    save()
  }

  function deleteMovie(id: string) {
    const next = state.value.filter((m) => m.id !== id)
    if (next.length === state.value.length) throw new Error('Фильм не найден')
    state.value = next
    save()
  }

  function exportToJson(): string {
    return JSON.stringify(state.value, null, 2)
  }

  function importFromJson(text: string) {
    const data = safeParse<Movie[]>(text)
    if (!Array.isArray(data)) throw new Error('Неверный формат файла')
    if (!data.every((m) => m && typeof m.id === 'string' && typeof m.title === 'string')) {
      throw new Error('Неверные данные фильмов')
    }
    setMovies(data)
  }

  function resetToDefaults() {
    setMovies(initialMovies)
  }

  return {
    movies: state,
    allGenres,
    allActors,
    addMovie,
    updateMovie,
    deleteMovie,
    setMovies,
    exportToJson,
    importFromJson,
    resetToDefaults,
  }
}
