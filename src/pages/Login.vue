<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
</script>

<template>
  <section class="min-h-screen bg-slate-950 text-white grid place-items-center">
    <div class="w-full max-w-sm rounded-xl bg-slate-900 p-6 ring-1 ring-white/10">
      <h1 class="text-xl font-semibold">Вход</h1>
      <form class="mt-4 space-y-3" @submit.prevent>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full rounded bg-slate-800 px-3 py-2"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Пароль"
          class="w-full rounded bg-slate-800 px-3 py-2"
        />
        <button class="w-full rounded bg-blue-600 px-3 py-2 font-medium hover:bg-blue-500">
          Войти
        </button>
      </form>
      <div class="mt-4 text-center text-sm text-slate-400">
        Демо-версия без серверной авторизации
      </div>
      <div class="mt-3 text-center">
        <RouterLink to="/" class="underline text-slate-300">На главную</RouterLink>
      </div>
    </div>
  </section>
</template>
