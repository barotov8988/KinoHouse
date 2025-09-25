<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDataStore } from '@/store/dataStore'
import type { Movie, Genre } from '@/data/movies'

const {
  movies,
  addMovie,
  updateMovie,
  deleteMovie,
  exportToJson,
  importFromJson,
  resetToDefaults,
  allGenres,
} = useDataStore()

const q = ref('')
const filtered = computed(() => {
  const query = q.value.trim().toLowerCase()
  return movies.value.filter(
    (m) =>
      !query ||
      m.title.toLowerCase().includes(query) ||
      (m.originalTitle && m.originalTitle.toLowerCase().includes(query)) ||
      String(m.year).includes(query),
  )
})

const showForm = ref(false)
const editId = ref<string | null>(null)
const form = ref<Movie>({
  id: '',
  type: 'movie',
  title: '',
  originalTitle: '',
  year: new Date().getFullYear(),
  runtime: 120,
  seasons: undefined,
  overview: '',
  rating: 7,
  votes: 0,
  genres: [],
  cast: [],
  posterUrl: '',
  backdropUrl: '',
  trailerYoutubeId: '',
})

function openCreate() {
  editId.value = null
  form.value = {
    id: '',
    type: 'movie',
    title: '',
    originalTitle: '',
    year: new Date().getFullYear(),
    runtime: 120,
    seasons: undefined,
    overview: '',
    rating: 7,
    votes: 0,
    genres: [],
    cast: [],
    posterUrl: '',
    backdropUrl: '',
    trailerYoutubeId: '',
  }
  showForm.value = true
}

function openEdit(m: Movie) {
  editId.value = m.id
  form.value = JSON.parse(JSON.stringify(m))
  showForm.value = true
}

function saveForm() {
  const payload: Movie = {
    ...form.value,
    year: Number(form.value.year),
    runtime: form.value.type === 'movie' ? Number(form.value.runtime) : undefined,
    seasons: form.value.type === 'series' ? Number(form.value.seasons) : undefined,
  }
  if (!payload.id || !payload.title || !payload.posterUrl) {
    alert('ID, Название и Постер обязательны')
    return
  }
  if (editId.value) {
    updateMovie(editId.value, payload)
  } else {
    addMovie(payload)
  }
  showForm.value = false
}

function remove(id: string) {
  if (confirm('Удалить?')) deleteMovie(id)
}

const importText = ref('')
const showImport = ref(false)
function runImport() {
  try {
    importFromJson(importText.value)
    showImport.value = false
    importText.value = ''
  } catch (e: any) {
    alert(e.message || String(e))
  }
}

function downloadExport() {
  const blob = new Blob([exportToJson()], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'movies.json'
  a.click()
  URL.revokeObjectURL(url)
}

function genreToggle(g: Genre) {
  const set = new Set(form.value.genres)
  if (set.has(g)) set.delete(g)
  else set.add(g)
  form.value.genres = Array.from(set)
}

function setCastFromString(s: string) {
  const names = s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
  form.value.cast = Array.from(new Set(names)).map((name) => ({ id: name, name }))
}

function castAsString() {
  return form.value.cast.map((c) => c.name).join(', ')
}

const serverMetrics = [
  { name: 'CPU', value: '23%' },
  { name: 'RAM', value: '1.8 GB / 8 GB' },
  { name: 'Uptime', value: '12д 05:33:12' },
  { name: 'Requests (1m)', value: '134' },
]

const dbMetrics = [
  { name: 'Connections', value: '6' },
  { name: 'Size', value: '48 MB' },
  { name: 'TPS', value: '0.7' },
  { name: 'Latency p95', value: '12 ms' },
]

const logs = [{ ts: '12:01:12', level: 'INFO', msg: 'Admin dashboard opened' }]
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
      <h1 class="text-2xl font-bold mb-6">Админка • Управление данными</h1>

      <div class="grid gap-6">
        <div class="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div class="text-lg font-semibold">Фильмы и сериалы</div>
            <div class="flex gap-2">
              <button class="rounded bg-blue-600 px-3 py-1 hover:bg-blue-500" @click="openCreate">
                Добавить
              </button>
              <button
                class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700"
                @click="downloadExport"
              >
                Экспорт JSON
              </button>
              <button
                class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700"
                @click="showImport = true"
              >
                Импорт JSON
              </button>
              <button
                class="rounded bg-red-700 px-3 py-1 hover:bg-red-600"
                @click="resetToDefaults"
              >
                Сброс к демо-данным
              </button>
            </div>
          </div>

          <div class="mb-3">
            <input
              v-model="q"
              type="search"
              placeholder="Поиск по названию/году"
              class="w-full rounded bg-slate-800 px-3 py-2"
            />
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="text-left text-slate-300">
                <tr>
                  <th class="px-3 py-2">ID</th>
                  <th class="px-3 py-2">Название</th>
                  <th class="px-3 py-2">Год</th>
                  <th class="px-3 py-2">Тип</th>
                  <th class="px-3 py-2">Рейтинг</th>
                  <th class="px-3 py-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in filtered" :key="m.id" class="border-t border-white/10">
                  <td class="px-3 py-2 text-slate-400">{{ m.id }}</td>
                  <td class="px-3 py-2">{{ m.title }}</td>
                  <td class="px-3 py-2 text-slate-300">{{ m.year }}</td>
                  <td class="px-3 py-2 text-slate-300">{{ m.type }}</td>
                  <td class="px-3 py-2">
                    <span class="rounded bg-yellow-500/20 px-1.5 py-0.5 text-yellow-300"
                      >★ {{ m.rating }}</span
                    >
                  </td>
                  <td class="px-3 py-2">
                    <div class="flex gap-2">
                      <button
                        class="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
                        @click="openEdit(m)"
                      >
                        Редактировать
                      </button>
                      <button
                        class="rounded bg-red-700 px-2 py-1 hover:bg-red-600"
                        @click="remove(m.id)"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
            <h2 class="font-semibold mb-3">Сервер</h2>
            <dl class="grid grid-cols-2 gap-3 text-slate-300">
              <template v-for="m in serverMetrics" :key="m.name">
                <dt class="text-slate-400">{{ m.name }}</dt>
                <dd class="text-right">{{ m.value }}</dd>
              </template>
            </dl>
            <div class="mt-4 flex gap-2">
              <button class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700">Перезапуск</button>
              <button class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700">
                Очистить кэш
              </button>
            </div>
          </div>

          <div class="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
            <h2 class="font-semibold mb-3">База данных</h2>
            <dl class="grid grid-cols-2 gap-3 text-slate-300">
              <template v-for="m in dbMetrics" :key="m.name">
                <dt class="text-slate-400">{{ m.name }}</dt>
                <dd class="text-right">{{ m.value }}</dd>
              </template>
            </dl>
            <div class="mt-4 flex gap-2">
              <button class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700">
                Снимок бэкапа
              </button>
              <button class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700">
                Проверка целостности
              </button>
            </div>
          </div>
        </div>

        <div class="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
          <h2 class="font-semibold mb-3">Логи</h2>
          <div class="space-y-2 text-sm">
            <div v-for="l in logs" :key="l.ts" class="flex items-center gap-3">
              <span class="text-slate-400">{{ l.ts }}</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded text-xs',
                  l.level === 'INFO' && 'bg-slate-700 text-slate-200',
                  l.level === 'WARN' && 'bg-yellow-600/30 text-yellow-200',
                  l.level === 'ERROR' && 'bg-red-600/30 text-red-200',
                ]"
              >
                {{ l.level }}
              </span>
              <span class="text-slate-200">{{ l.msg }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 z-20 grid place-items-center bg-black/60 p-4">
      <div class="w-full max-w-2xl rounded-xl bg-slate-900 p-6 ring-1 ring-white/10">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{ editId ? 'Редактировать' : 'Добавить' }} элемент</h2>
          <button class="text-slate-400 hover:text-white" @click="showForm = false">✕</button>
        </div>
        <form class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="saveForm">
          <label class="grid gap-1">
            <span class="text-sm text-slate-300">ID</span>
            <input v-model="form.id" :readonly="!!editId" class="rounded bg-slate-800 px-3 py-2" />
          </label>
          <label class="grid gap-1">
            <span class="text-sm text-slate-300">Тип</span>
            <select v-model="form.type" class="rounded bg-slate-800 px-3 py-2">
              <option value="movie">movie</option>
              <option value="series">series</option>
            </select>
          </label>
          <label class="grid gap-1 md:col-span-2">
            <span class="text-sm text-slate-300">Название</span>
            <input v-model="form.title" class="rounded bg-slate-800 px-3 py-2" />
          </label>
          <label class="grid gap-1 md:col-span-2">
            <span class="text-sm text-slate-300">Оригинальное название</span>
            <input v-model="form.originalTitle" class="rounded bg-slate-800 px-3 py-2" />
          </label>
          <label class="grid gap-1">
            <span class="text-sm text-slate-300">Год</span>
            <input
              v-model.number="form.year"
              type="number"
              class="rounded bg-slate-800 px-3 py-2"
            />
          </label>
          <label v-if="form.type === 'movie'" class="grid gap-1">
            <span class="text-sm text-slate-300">Длительность (мин)</span>
            <input
              v-model.number="form.runtime"
              type="number"
              class="rounded bg-slate-800 px-3 py-2"
            />
          </label>
          <label v-else class="grid gap-1">
            <span class="text-sm text-slate-300">Сезонов</span>
            <input
              v-model.number="form.seasons"
              type="number"
              class="rounded bg-slate-800 px-3 py-2"
            />
          </label>
          <label class="grid gap-1 md:col-span-2">
            <span class="text-sm text-slate-300">Описание</span>
            <textarea
              v-model="form.overview"
              rows="3"
              class="rounded bg-slate-800 px-3 py-2"
            ></textarea>
          </label>
          <label class="grid gap-1">
            <span class="text-sm text-slate-300">Рейтинг (0-10)</span>
            <input
              v-model.number="form.rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              class="rounded bg-slate-800 px-3 py-2"
            />
          </label>
          <label class="grid gap-1">
            <span class="text-sm text-slate-300">Голоса</span>
            <input
              v-model.number="form.votes"
              type="number"
              class="rounded bg-slate-800 px-3 py-2"
            />
          </label>
          <div class="md:col-span-2">
            <div class="text-sm text-slate-300 mb-1">Жанры</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="g in allGenres"
                :key="g"
                type="button"
                @click="genreToggle(g)"
                :class="[
                  'rounded-full px-3 py-1 text-sm',
                  form.genres.includes(g) ? 'bg-blue-600' : 'bg-slate-800',
                ]"
              >
                {{ g }}
              </button>
            </div>
          </div>
          <label class="grid gap-1 md:col-span-2">
            <span class="text-sm text-slate-300">Актёры (через запятую)</span>
            <input
              :value="castAsString()"
              @input="setCastFromString(($event.target as HTMLInputElement).value)"
              class="rounded bg-slate-800 px-3 py-2"
            />
          </label>
          <label class="grid gap-1 md:col-span-2">
            <span class="text-sm text-slate-300">Poster URL</span>
            <input v-model="form.posterUrl" class="rounded bg-slate-800 px-3 py-2" />
          </label>
          <label class="grid gap-1 md:col-span-2">
            <span class="text-sm text-slate-300">Backdrop URL</span>
            <input v-model="form.backdropUrl" class="rounded bg-slate-800 px-3 py-2" />
          </label>
          <label class="grid gap-1 md:col-span-2">
            <span class="text-sm text-slate-300">YouTube трейлер ID</span>
            <input v-model="form.trailerYoutubeId" class="rounded bg-slate-800 px-3 py-2" />
          </label>

          <div class="md:col-span-2 mt-2 flex justify-end gap-2">
            <button
              type="button"
              class="rounded bg-slate-800 px-4 py-2 hover:bg-slate-700"
              @click="showForm = false"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showImport" class="fixed inset-0 z-20 grid place-items-center bg-black/60 p-4">
      <div class="w-full max-w-2xl rounded-xl bg-slate-900 p-6 ring-1 ring-white/10">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Импорт JSON</h2>
          <button class="text-slate-400 hover:text-white" @click="showImport = false">✕</button>
        </div>
        <textarea
          v-model="importText"
          rows="12"
          class="mt-4 w-full rounded bg-slate-800 p-3"
        ></textarea>
        <div class="mt-3 flex justify-end gap-2">
          <button
            class="rounded bg-slate-800 px-4 py-2 hover:bg-slate-700"
            @click="showImport = false"
          >
            Отмена
          </button>
          <button
            class="rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
            @click="runImport"
          >
            Импортировать
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
