<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Movie } from '@/data/movies'

interface Props {
  movie: Movie
}

const props = defineProps<Props>()

// 3D tilt effect on hover/mouse move
const wrapper = ref<HTMLElement | null>(null)
const rx = ref(0)
const ry = ref(0)
const scale = ref(1)

function onMove(e: MouseEvent) {
  const el = wrapper.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width // 0..1
  const py = (e.clientY - rect.top) / rect.height // 0..1
  const max = 8 // deg
  ry.value = (px - 0.5) * 2 * max
  rx.value = -(py - 0.5) * 2 * max
}
function onEnter() {
  scale.value = 1.02
}
function onLeave() {
  rx.value = 0
  ry.value = 0
  scale.value = 1
}

const transformStyle = computed(() => `perspective(900px) rotateX(${rx.value.toFixed(2)}deg) rotateY(${ry.value.toFixed(2)}deg) scale(${scale.value.toFixed(3)})`)
</script>

<template>
  <RouterLink
    :to="`/movie/${props.movie.id}`"
    ref="wrapper"
    class="group relative block overflow-hidden rounded-2xl bg-slate-900/60 ring-1 ring-white/10 transition-shadow hover:shadow-2xl hover:ring-white/20"
    @mousemove="onMove"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    :style="{ transform: transformStyle }"
  >
    <!-- Poster -->
    <img
      :src="props.movie.posterUrl"
      :alt="props.movie.title"
      loading="lazy"
      class="h-80 w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
    />

    <!-- Top badges -->
    <div class="pointer-events-none absolute left-0 right-0 top-0 flex justify-between p-2">
      <span class="rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">{{ props.movie.type === 'series' ? 'Сериал' : 'Фильм' }}</span>
      <span class="rounded-full bg-yellow-500/90 px-2 py-1 text-xs font-semibold text-black">★ {{ props.movie.rating }}</span>
    </div>

    <!-- Gradient + title -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90"></div>
    <div class="absolute inset-x-0 bottom-0 p-3">
      <h3 class="line-clamp-2 font-semibold tracking-tight text-white drop-shadow-md">{{ props.movie.title }}</h3>
      <div class="mt-1 flex items-center justify-between text-xs text-slate-300">
        <span>{{ props.movie.year }}</span>
        <span class="truncate">{{ props.movie.genres.join(', ') }}</span>
      </div>
    </div>

    <!-- Shine on hover -->
    <div class="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden>
      <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent blur-md"></div>
    </div>
  </RouterLink>
</template>

<style scoped>
/***** Smooth entry animation *****/
:where(a, div).group { transform-style: preserve-3d; }
@keyframes cardIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.group { animation: cardIn .4s ease-out both; }
</style>
