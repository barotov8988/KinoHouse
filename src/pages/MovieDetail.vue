<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useDataStore } from '@/store/dataStore'
const { movies } = useDataStore()

const route = useRoute()
const movie = computed(() => movies.find((m) => m.id === String(route.params.id)))
</script>

<template>
  <section v-if="movie" class="min-h-screen bg-slate-950 text-white">
    <header class="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
      <RouterLink to="/" class="text-xl font-bold tracking-tight">Кинотека</RouterLink>
      <nav class="flex items-center gap-6 text-slate-200">
        <RouterLink to="/catalog" class="hover:text-white">Каталог</RouterLink>
        <RouterLink to="/admin" class="hover:text-white">Админка</RouterLink>
      </nav>
    </header>

    <div class="relative">
      <img
        v-if="movie.backdropUrl"
        :src="movie.backdropUrl"
        :alt="movie.title"
        class="h-72 w-full object-cover opacity-40"
      />
      <div
        class="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950"
      ></div>
    </div>

    <div class="mx-auto -mt-24 max-w-7xl px-4">
      <div class="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-8 items-start">
        <img
          :src="movie.posterUrl"
          :alt="movie.title"
          class="w-56 rounded-xl ring-1 ring-white/10"
        />

        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold">{{ movie.title }}</h1>
          <div class="mt-2 flex flex-wrap items-center gap-3 text-slate-300">
            <span class="rounded bg-yellow-500/20 px-2 py-0.5 text-yellow-300"
              >★ {{ movie.rating }}</span
            >
            <span>{{ movie.year }}</span>
            <span class="text-slate-400">•</span>
            <span v-if="movie.type === 'movie'">{{ movie.runtime }} мин</span>
            <span v-else>Сезонов: {{ movie.seasons }}</span>
            <span class="text-slate-400">•</span>
            <span>{{ movie.genres.join(', ') }}</span>
          </div>

          <p class="mt-4 text-slate-200 leading-relaxed">{{ movie.overview }}</p>

          <div class="mt-6">
            <h2 class="text-lg font-semibold">В ролях</h2>
            <div class="mt-2 flex flex-wrap gap-2 text-slate-300">
              <span
                v-for="c in movie.cast"
                :key="c.id"
                class="rounded-full bg-slate-800 px-3 py-1 text-sm"
              >
                {{ c.name }}
              </span>
            </div>
          </div>

          <div v-if="movie.trailerYoutubeId" class="mt-8">
            <h2 class="text-lg font-semibold">Трейлер</h2>
            <div class="mt-2 aspect-video w-full overflow-hidden rounded-xl ring-1 ring-white/10">
              <iframe
                :src="`https://www.youtube.com/embed/${movie.trailerYoutubeId}`"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                class="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <RouterLink
          to="/catalog"
          class="inline-flex items-center rounded-md bg-slate-800 px-4 py-2 text-slate-200 hover:bg-slate-700"
        >
          ← Назад к каталогу
        </RouterLink>
      </div>
    </div>
  </section>

  <section v-else class="min-h-screen bg-slate-950 text-slate-200">
    <div class="mx-auto max-w-3xl px-4 py-24 text-center">
      Не найдено
      <div class="mt-6">
        <RouterLink to="/catalog" class="underline">Вернуться</RouterLink>
      </div>
    </div>
  </section>
</template>
