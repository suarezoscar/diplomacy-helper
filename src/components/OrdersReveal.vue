<script setup>
import { useGameStore } from '@/stores/game'
import { formatOrder, POWERS } from '@/constants/diplomacy'
import { useI18n } from '@/i18n'
import { flagFor, orderIcon, unitIcon } from '@/constants/icons'

const { t, tPowerFull } = useI18n()
const gameStore = useGameStore()

function getPowerColor(powerId) {
  const p = POWERS.find((pw) => pw.id === powerId)
  return p ? p.color : '#666'
}
</script>

<template>
  <div class="mt-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm text-text-secondary flex items-center gap-2">
        <span>👁️</span>
        {{ t('game.allOrders') }} — {{ t('game.round') }} {{ gameStore.currentRound?.round_number }}
      </h3>
      <span class="tag tag-success">{{ t('game.revealed') }}</span>
    </div>

    <div v-if="gameStore.allOrders.length === 0" class="card p-8 text-center text-sm text-text-muted">
      {{ t('game.noOrdersThisRound') }}
    </div>

    <div class="space-y-2.5">
      <div
        v-for="order in gameStore.allOrders"
        :key="order.$id"
        class="card px-4 py-3.5"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-base">{{ flagFor(order.power) }}</span>
            <span class="text-sm font-medium" :style="{ color: getPowerColor(order.power) }">{{ tPowerFull(order.power) }}</span>
          </div>
          <span class="text-xs text-text-muted">{{ order.player_name }}</span>
        </div>
        <p class="font-mono text-base text-text mb-1.5">{{ formatOrder(order) }}</p>
        <div class="flex gap-2 text-xs text-text-muted">
          <span>{{ orderIcon(order.order_type) }} {{ order.order_type }}</span>
          <span>&middot;</span>
          <span>{{ unitIcon(order.unit_type) }} {{ order.unit_type }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
