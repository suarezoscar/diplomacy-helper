<script setup>
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'
import { POWERS } from '@/constants/diplomacy'
import { useI18n } from '@/i18n'
import { flagFor } from '@/constants/icons'

const { t, tPowerFull } = useI18n()
const gameStore = useGameStore()
const playerStore = usePlayerStore()

function getPowerColor(powerId) {
  const p = POWERS.find((pw) => pw.id === powerId)
  return p ? p.color : '#555'
}
</script>

<template>
  <div>
    <h3 class="text-xs font-medium text-text-secondary mb-3 ml-1">
      {{ t('lobby.players') }} ({{ gameStore.players.length }}/{{ gameStore.game?.max_players || 7 }})
    </h3>
    <div class="space-y-2">
      <div
        v-for="player in gameStore.players"
        :key="player.$id"
        class="card px-4 py-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="text-sm text-text truncate">{{ player.name }}</span>
          <span v-if="playerStore.playerId === player.$id" class="text-[10px] text-text-muted shrink-0">{{ t('lobby.you') }}</span>
        </div>
        <div v-if="player.power" class="flex items-center gap-2 shrink-0">
          <span class="text-base">{{ flagFor(player.power) }}</span>
          <span class="text-xs" :style="{ color: getPowerColor(player.power) }">            {{ tPowerFull(player.power) }}</span>
        </div>
        <span v-else class="text-xs text-text-muted shrink-0">{{ t('lobby.noPower') }}</span>
      </div>
    </div>
    <div v-if="gameStore.players.length === 0" class="text-center text-xs text-text-muted py-8">
      {{ t('lobby.noPlayers') }}
    </div>
  </div>
</template>
