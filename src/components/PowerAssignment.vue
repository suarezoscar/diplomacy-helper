<script setup>
import { ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { POWERS } from '@/constants/diplomacy'
import { useI18n } from '@/i18n'
import { flagFor } from '@/constants/icons'

const { t, tPowerFull } = useI18n()
const emit = defineEmits(['assign'])
const gameStore = useGameStore()

function buildAssignments() {
  const result = {}
  for (const player of gameStore.players) {
    if (player.power) {
      result[player.$id] = player.power
    }
  }
  return result
}

const assignments = ref(buildAssignments())

watch(
  () => gameStore.players.map((p) => p.power),
  () => { assignments.value = buildAssignments() }
)

function assignPower(playerId, powerId) {
  assignments.value = { ...assignments.value, [playerId]: powerId }
}

function confirm() {
  const list = Object.entries(assignments.value).map(([playerId, power]) => ({ playerId, power }))
  emit('assign', list)
}

function getPowerColor(powerId) {
  const p = POWERS.find((pw) => pw.id === powerId)
  return p ? p.color : '#555'
}

function isAssigned(powerId, currentPlayerId) {
  if (assignments.value[currentPlayerId] === powerId) return false
  return Object.values(assignments.value).includes(powerId)
}
</script>

<template>
  <div class="card-elevated p-4">
    <h4 class="text-xs text-text-secondary mb-3">{{ t('lobby.manualAssignment') }}</h4>
    <div class="space-y-2">
      <div
        v-for="player in gameStore.players"
        :key="player.$id"
        class="flex items-center gap-2"
      >
        <span class="text-sm text-text w-24 truncate shrink-0">{{ player.name }}</span>
        <select
          :value="assignments[player.$id] || player.power || ''"
          @change="assignPower(player.$id, $event.target.value)"
          class="flex-1 !text-xs !py-1.5"
        >
          <option value="" disabled>{{ t('lobby.selectPower') }}</option>
          <option
            v-for="power in POWERS"
            :key="power.id"
            :value="power.id"
            :disabled="isAssigned(power.id, player.$id) && !player.power"
          >
            {{ flagFor(power.id) }} {{ tPowerFull(power.id) }}
          </option>
        </select>
        <span
          v-if="player.power || assignments[player.$id]"
          class="h-3 w-3 rounded-full shrink-0"
          :style="{ backgroundColor: getPowerColor(player.power || assignments[player.$id]) }"
        ></span>
      </div>
    </div>
    <button @click="confirm" class="btn-secondary w-full mt-4 py-2 text-sm">
      {{ t('lobby.applyAssignments') }}
    </button>
  </div>
</template>
