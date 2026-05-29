<script setup>
import { RouterView } from 'vue-router'
import { useI18n } from '@/i18n'

const { locale, locales, setLocale } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="px-4 py-3 flex items-center justify-between border-b border-border">
      <div class="flex items-center gap-2">
        <span class="text-xl">⚜</span>
        <span class="font-heading text-sm tracking-wider text-text-secondary">DIPLOMACY</span>
      </div>
      <select
        :value="locale"
        @change="setLocale($event.target.value)"
        class="!w-auto !text-xs !py-1 !px-2 !bg-transparent !border-border-light"
      >
        <option v-for="l in locales" :key="l.code" :value="l.code">{{ l.name }}</option>
      </select>
    </header>
    <main class="flex-1">
      <RouterView />
    </main>
    <footer class="px-4 py-3 text-center border-t border-border">
      <p class="text-xs text-text-muted">Diplomacy Helper &copy; 2026</p>
    </footer>
  </div>
</template>
