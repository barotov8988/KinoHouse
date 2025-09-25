<script setup lang="ts">
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

const logs = [
  { ts: '12:01:12', level: 'INFO', msg: 'Server started on :5173' },
  { ts: '12:05:23', level: 'INFO', msg: 'Static dataset loaded (8 items)' },
  { ts: '12:08:01', level: 'WARN', msg: 'Cache miss: /catalog?q=matrix' },
]
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
      <h1 class="text-2xl font-bold mb-6">Админка • Диагностика и управление</h1>

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
            <button class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700">Очистить кэш</button>
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
            <button class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700">Снимок бэкапа</button>
            <button class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700">Проверка целостности</button>
          </div>
        </div>
      </div>

      <div class="mt-6 grid md:grid-cols-2 gap-6">
        <div class="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
          <h2 class="font-semibold mb-3">Управление контентом</h2>
          <div class="flex flex-wrap gap-2">
            <RouterLink to="/catalog" class="rounded bg-blue-600 px-3 py-1 hover:bg-blue-500">Каталог</RouterLink>
            <button class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700">Импорт</button>
            <button class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700">Экспорт</button>
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
  </section>
</template>
