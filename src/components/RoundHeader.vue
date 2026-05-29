<script setup>
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const gameStore = useGameStore()
const playerStore = usePlayerStore()
</script>

<template>
  <div v-if="gameStore.currentRound" class="card px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <span class="font-heading text-sm text-text">{{ t('game.round') }} {{ gameStore.currentRound.round_number }}</span>
      <span class="tag" :class="gameStore.currentRound.status === 'revealed' ? 'tag-success' : 'tag-warning'">
        {{ gameStore.currentRound.status === 'revealed' ? '\uD83D\uDC41\uFE0F' : '\u270F\uFE0F' }}
        {{ gameStore.currentRound.status === 'revealed' ? t('game.revealed') : t('game.writing') }}
      </span>
    </div>
    <div class="text-xs text-text-muted">
      {{ t('game.player') }}: {{ playerStore.playerName }}
    </div>
  </div>
</template>
