<script setup lang="ts">
import { movies } from '@/data/movies'
</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
    <header class="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
      <RouterLink to="/" class="text-xl font-bold tracking-tight">Кинотека</RouterLink>
      <nav class="flex items-center gap-6 text-slate-200">
        <RouterLink to="/catalog" class="hover:text-white">Каталог</RouterLink>
        <RouterLink to="/admin" class="hover:text-white">Админка</RouterLink>
      </nav>
    </header>

    <div class="mx-auto max-w-7xl px-4 py-16">
      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 class="text-4xl md:text-6xl font-extrabold leading-tight">
            Онлайн-кинотека
          </h1>
          <p class="mt-4 text-slate-300 text-lg">
            Пои��к фильмов и сериалов по жанрам, актёрам и годам. Рейтинги и
            отзывы. Трейлеры и постеры.
          </p>
          <div class="mt-8">
            <RouterLink
              to="/catalog"
              class="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500"
            >
              Перейти в каталог
            </RouterLink>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <RouterLink
            v-for="m in movies.slice(0, 6)"
            :key="m.id"
            :to="`/movie/${m.id}`"
            class="group relative overflow-hidden rounded-xl bg-slate-800 ring-1 ring-white/10 hover:ring-white/20"
          >
            <img :src="m.posterUrl" :alt="m.title" class="h-48 w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-0 p-2 text-sm">
              <div class="font-semibold group-hover:underline">{{ m.title }}</div>
              <div class="text-slate-300 text-xs">{{ m.year }}</div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
