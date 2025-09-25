<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@/store/dataStore'
import type { Genre, Movie } from '@/data/movies'
import MovieCard from '@/components/MovieCard.vue'

const { movies, allGenres, allActors } = useDataStore()

// Search & Filters
const q = ref('')
const selectedGenres = ref<Genre[]>([])
const type = ref<'movie' | 'series' | ''>('')
const yearFrom = ref<number | null>(null)
const yearTo = ref<number | null>(null)
const ratingFrom = ref<number>(0)
const ratingTo = ref<number>(10)
const actor = ref<string>('')
const sort = ref<'rating_desc' | 'year_desc' | 'title_asc'>('rating_desc')

const years = computed(() => {
  const ys = new Set<number>()
  movies.forEach((m) => ys.add(m.year))
  return Array.from(ys).sort((a, b) => a - b)
})
const minYear = computed(() => years.value[0] ?? 1900)
const maxYear = computed(() => years.value[years.value.length - 1] ?? new Date().getFullYear())

// Derived list with filtering and sorting
const filteredSorted = computed<Movie[]>(() => {
  const query = q.value.trim().toLowerCase()
  const yf = yearFrom.value ?? minYear.value
  const yt = yearTo.value ?? maxYear.value
  const rf = Math.min(ratingFrom.value, ratingTo.value)
  const rt = Math.max(ratingFrom.value, ratingTo.value)

  const filtered = movies.filter((m) => {
    const byQuery =
      !query ||
      m.title.toLowerCase().includes(query) ||
      (m.originalTitle && m.originalTitle.toLowerCase().includes(query))

    const byGenres = !selectedGenres.value.length || selectedGenres.value.every((g) => m.genres.includes(g))
    const byType = !type.value || m.type === type.value
    const byYear = m.year >= yf && m.year <= yt
    const byRating = m.rating >= rf && m.rating <= rt
    const byActor = !actor.value || m.cast.some((c) => c.name === actor.value)

    return byQuery && byGenres && byType && byYear && byRating && byActor
  })

  const arr = [...filtered]
  switch (sort.value) {
    case 'year_desc':
      arr.sort((a, b) => b.year - a.year)
      break
    case 'title_asc':
      arr.sort((a, b) => a.title.localeCompare(b.title))
      break
    default:
      arr.sort((a, b) => b.rating - a.rating)
  }
  return arr
})

// Query params sync
const route = useRoute()
const router = useRouter()
function toQuery() {
  return {
    q: q.value || undefined,
    genres: selectedGenres.value.length ? selectedGenres.value.join(',') : undefined,
    type: type.value || undefined,
    yfrom: yearFrom.value ?? undefined,
    yto: yearTo.value ?? undefined,
    rfrom: ratingFrom.value !== 0 ? ratingFrom.value.toFixed(1) : undefined,
    rto: ratingTo.value !== 10 ? ratingTo.value.toFixed(1) : undefined,
    actor: actor.value || undefined,
    sort: sort.value !== 'rating_desc' ? sort.value : undefined,
  }
}
function fromQuery() {
  const qy = route.query
  q.value = typeof qy.q === 'string' ? qy.q : ''
  selectedGenres.value = typeof qy.genres === 'string' && qy.genres
    ? qy.genres.split(',').filter(Boolean) as Genre[]
    : []
  type.value = qy.type === 'movie' || qy.type === 'series' ? (qy.type as 'movie' | 'series') : ''
  const yf = Number(qy.yfrom)
  const yt = Number(qy.yto)
  yearFrom.value = Number.isFinite(yf) ? yf : null
  yearTo.value = Number.isFinite(yt) ? yt : null
  const rf = Number(qy.rfrom)
  const rt = Number(qy.rto)
  ratingFrom.value = Number.isFinite(rf) ? Math.max(0, Math.min(10, rf)) : 0
  ratingTo.value = Number.isFinite(rt) ? Math.max(0, Math.min(10, rt)) : 10
  actor.value = typeof qy.actor === 'string' ? qy.actor : ''
  sort.value = (['rating_desc', 'year_desc', 'title_asc'] as const).includes(qy.sort as any)
    ? (qy.sort as any)
    : 'rating_desc'
}

onMounted(() => {
  fromQuery()
  if (yearFrom.value == null) yearFrom.value = minYear.value
  if (yearTo.value == null) yearTo.value = maxYear.value
})

watch([q, selectedGenres, type, yearFrom, yearTo, ratingFrom, ratingTo, actor, sort], () => {
  router.replace({ query: toQuery() })
})

function toggleGenre(g: Genre) {
  const idx = selectedGenres.value.indexOf(g)
  if (idx === -1) selectedGenres.value.push(g)
  else selectedGenres.value.splice(idx, 1)
}
function clearFilters() {
  q.value = ''
  selectedGenres.value = []
  type.value = ''
  yearFrom.value = null
  yearTo.value = null
  ratingFrom.value = 0
  ratingTo.value = 10
  actor.value = ''
  sort.value = 'rating_desc'
}
</script>

<template>
  <section class="relative min-h-screen overflow-hidden bg-slate-950 text-white">
    <!-- Animated background -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-500/40 via-fuchsia-500/40 to-transparent blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-400/40 via-emerald-400/40 to-transparent blur-3xl animate-ping"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(236,72,153,.12),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(34,197,94,.10),transparent_35%)]"></div>
    </div>

    <!-- Header -->
    <header class="relative mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
      <RouterLink to="/" class="text-2xl font-extrabold tracking-tight">
        <span class="bg-gradient-to-r from-blue-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">Кинотека</span>
      </RouterLink>
      <nav class="flex items-center gap-6 text-slate-300">
        <RouterLink to="/catalog" class="transition-colors hover:text-white">Каталог</RouterLink>
        <RouterLink to="/admin" class="transition-colors hover:text-white">Админка</RouterLink>
      </nav>
    </header>

    <!-- Hero -->
    <div class="relative mx-auto max-w-7xl px-4 pb-6 pt-8 md:pt-16">
      <div class="grid items-center gap-10 md:grid-cols-2">
        <div>
          <h1 class="text-4xl font-black leading-tight md:text-6xl">
            <span class="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Онлайн‑кинотека</span>
          </h1>
          <p class="mt-4 text-lg text-slate-300">
            Умный поиск, фильтры по жанрам, типам, годам и рейтингу. Топ‑карточки с плавными анимациями.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <RouterLink to="/catalog" class="rounded-xl bg-white px-5 py-2.5 font-semibold text-slate-900 shadow hover:shadow-lg transition">Перейти в каталог</RouterLink>
            <a href="#filters" class="rounded-xl border border-white/20 px-5 py-2.5 font-semibold text-white/90 hover:bg-white/10 transition">Настроить фильтры</a>
          </div>
        </div>
        <div class="relative">
          <div class="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-blue-500/20 via-fuchsia-500/20 to-emerald-500/20 blur-2xl"></div>
          <div class="grid grid-cols-3 gap-3">
            <MovieCard v-for="m in movies.slice(0, 6)" :key="m.id" :movie="m" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div id="filters" class="relative mx-auto max-w-7xl px-4 pb-8">
      <div class="sticky top-0 z-20 -mx-4 mb-6 border-y border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div class="md:col-span-4">
            <input v-model="q" type="search" placeholder="Поиск по названию"
              class="w-full rounded-xl bg-slate-900/60 px-4 py-2.5 text-white placeholder:text-slate-400 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="md:col-span-4 flex flex-wrap gap-2">
            <button v-for="g in allGenres" :key="g" type="button"
              @click="toggleGenre(g)"
              class="rounded-full px-3 py-1.5 text-sm ring-1 transition select-none"
              :class="selectedGenres.includes(g) ? 'bg-blue-500 text-white ring-blue-500' : 'bg-slate-900/60 text-slate-300 ring-white/10 hover:ring-white/20'">
              {{ g }}
            </button>
          </div>
          <div class="md:col-span-2 flex items-center gap-2">
            <button type="button" @click="type = type === 'movie' ? '' : 'movie'" :class="['rounded-full px-3 py-1.5 text-sm ring-1 transition', type === 'movie' ? 'bg-emerald-500 text-black ring-emerald-500' : 'bg-slate-900/60 text-slate-300 ring-white/10 hover:ring-white/20']">Фильмы</button>
            <button type="button" @click="type = type === 'series' ? '' : 'series'" :class="['rounded-full px-3 py-1.5 text-sm ring-1 transition', type === 'series' ? 'bg-emerald-500 text-black ring-emerald-500' : 'bg-slate-900/60 text-slate-300 ring-white/10 hover:ring-white/20']">Сериалы</button>
          </div>
          <div class="md:col-span-2">
            <select v-model="actor" class="w-full rounded-xl bg-slate-900/60 px-3 py-2.5 ring-1 ring-white/10">
              <option value="">Актёр</option>
              <option v-for="a in allActors" :key="a.id" :value="a.name">{{ a.name }}</option>
            </select>
          </div>
          <div class="md:col-span-6 flex items-center gap-3">
            <div class="w-full">
              <label class="mb-1 block text-xs text-slate-400">Год выпуска: {{ (yearFrom ?? minYear) }} — {{ (yearTo ?? maxYear) }}</label>
              <div class="flex items-center gap-2">
                <input type="range" :min="minYear" :max="maxYear" v-model.number="yearFrom" class="w-full accent-blue-500" />
                <input type="range" :min="minYear" :max="maxYear" v-model.number="yearTo" class="w-full accent-blue-500" />
              </div>
            </div>
          </div>
          <div class="md:col-span-4 flex items-center gap-3">
            <div class="w-full">
              <label class="mb-1 block text-xs text-slate-400">Рейтинг: {{ ratingFrom.toFixed(1) }} — {{ ratingTo.toFixed(1) }}</label>
              <div class="flex items-center gap-2">
                <input type="range" min="0" max="10" step="0.1" v-model.number="ratingFrom" class="w-full accent-yellow-500" />
                <input type="range" min="0" max="10" step="0.1" v-model.number="ratingTo" class="w-full accent-yellow-500" />
              </div>
            </div>
          </div>
          <div class="md:col-span-2 flex items-center gap-2">
            <select v-model="sort" class="w-full rounded-xl bg-slate-900/60 px-3 py-2.5 ring-1 ring-white/10">
              <option value="rating_desc">Сначала рейтинг</option>
              <option value="year_desc">Сначала новые</option>
              <option value="title_asc">По алфавиту</option>
            </select>
            <button type="button" @click="clearFilters" class="rounded-xl px-3 py-2 text-sm text-slate-200 ring-1 ring-white/10 hover:bg-white/10">Сброс</button>
          </div>
        </div>
      </div>

      <!-- Grid -->
      <TransitionGroup name="list" tag="div" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <MovieCard v-for="m in filteredSorted" :key="m.id" :movie="m" />
      </TransitionGroup>

      <div v-if="!filteredSorted.length" class="mt-12 text-center text-slate-400">Ничего не найдено</div>
    </div>
  </section>
</template>

<style scoped>
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(8px); }
.list-enter-active, .list-leave-active { transition: all .25s ease-out; }
</style>
