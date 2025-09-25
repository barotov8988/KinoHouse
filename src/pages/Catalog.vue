<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDataStore } from '@/store/dataStore'
const { movies, allGenres, allActors } = useDataStore()
import type { Genre } from '@/data/movies'

const q = ref('')
const genre = ref<Genre | ''>('')
const year = ref<number | ''>('')
const actor = ref<string>('')

const years = computed(() => {
  const ys = new Set<number>()
  movies.value.forEach((m) => ys.add(m.year))
  return Array.from(ys).sort((a, b) => b - a)
})

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase()
  return movies.value.filter((m) => {
    const byQuery =
      !query ||
      m.title.toLowerCase().includes(query) ||
      (m.originalTitle && m.originalTitle.toLowerCase().includes(query))
    const byGenre = !genre.value || m.genres.includes(genre.value)
    const byYear = !year.value || m.year === year.value
    const byActor = !actor.value || m.cast.some((c) => c.name === actor.value)
    return byQuery && byGenre && byYear && byActor
  })
})
</script>

<template>
  <section class="min-h-screen bg-slate-950 text-white">
    <header class="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
      <RouterLink to="/" class="text-xl font-bold tracking-tight">Кинотека</RouterLink>
      <nav class="flex items-center gap-6 text-slate-200">
        <RouterLink to="/catalog" class="hover:text-white">Каталог</RouterLink>
        <RouterLink to="/admin" class="hover:text-white">Админка</RouterLink>
      </nav>
    </header>

    <div class="mx-auto max-w-7xl px-4 pb-16">
      <div
        class="sticky top-0 z-10 -mx-4 mb-8 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur"
      >
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            v-model="q"
            type="search"
            placeholder="Поиск по названию"
            class="rounded-md bg-slate-800 px-3 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <select v-model="genre" class="rounded-md bg-slate-800 px-3 py-2">
            <option value="">Жанр</option>
            <option v-for="g in allGenres" :key="g" :value="g">{{ g }}</option>
          </select>

          <select v-model.number="year" class="rounded-md bg-slate-800 px-3 py-2">
            <option :value="''">Год</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>

          <select v-model="actor" class="rounded-md bg-slate-800 px-3 py-2">
            <option value="">Актёр</option>
            <option v-for="a in allActors" :key="a.id" :value="a.name">{{ a.name }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <RouterLink
          v-for="m in filtered"
          :key="m.id"
          :to="`/movie/${m.id}`"
          class="group overflow-hidden rounded-xl bg-slate-900 ring-1 ring-white/10 hover:ring-white/20"
        >
          <img :src="m.posterUrl" :alt="m.title" class="h-64 w-full object-cover" />
          <div class="p-3">
            <div class="truncate font-semibold">{{ m.title }}</div>
            <div class="mt-1 flex items-center justify-between text-sm text-slate-400">
              <span>{{ m.year }}</span>
              <span class="rounded bg-yellow-500/20 px-1.5 py-0.5 text-yellow-300"
                >★ {{ m.rating }}</span
              >
            </div>
            <div class="mt-1 text-xs text-slate-400 truncate">{{ m.genres.join(', ') }}</div>
          </div>
        </RouterLink>
      </div>

      <div v-if="!filtered.length" class="mt-12 text-center text-slate-400">Ничего не найдено</div>
    </div>
  </section>
</template>
