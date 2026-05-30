<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import { useAnonymousSession } from '@/composables/useAnonymousSession'
import { useGame } from '@/composables/useGame'
import { useOrders } from '@/composables/useOrders'
import { formatOrder, POWERS } from '@/constants/diplomacy'
import { useI18n } from '@/i18n'
import { flagFor, orderIcon, unitIcon } from '@/constants/icons'

const { t, format, tPowerFull } = useI18n()
const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const gameStore = useGameStore()
const { ensureSession } = useAnonymousSession()
const { getGameByCode, getPlayers } = useGame()
const { getRounds, getAllOrders } = useOrders()

const loading = ref(true)
const error = ref('')
const selectedRound = ref(null)
const selectedOrders = ref([])
const loadingOrders = ref(false)

const gameCode = computed(() => route.params.code)

onMounted(async () => {
  try {
    await ensureSession()
    const code = gameCode.value
    if (!playerStore.playerId) { router.push(`/game/${code}`); return }

    const game = await getGameByCode(code)
    if (!game) { error.value = t('common.gameNotFound'); loading.value = false; return }

    await getPlayers(game.$id)
    await getRounds(game.$id)
  } catch (e) { error.value = e.message } finally { loading.value = false }
})

const sortedRounds = computed(() => {
  const seen = new Map()
  return [...gameStore.rounds]
    .filter((r) => { if (seen.has(r.round_number)) return false; seen.set(r.round_number, true); return true })
    .sort((a, b) => b.round_number - a.round_number)
})

function getPowerColor(powerId) {
  const p = POWERS.find((pw) => pw.id === powerId)
  return p ? p.color : '#666'
}

async function selectRound(round) {
  selectedRound.value = round
  loadingOrders.value = true
  try { selectedOrders.value = await getAllOrders(round.$id) } catch { selectedOrders.value = [] } finally { loadingOrders.value = false }
}

function goBack() { router.push(`/game/${gameCode.value}/play`) }
</script>

<template>
  <div class="flex flex-col items-center px-4 py-5">
    <div class="w-full max-w-2xl">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="font-heading text-xl text-text">📋 {{ t('history.title') }}</h1>
          <p class="text-xs text-text-muted mt-1">{{ gameStore.game?.name }}</p>
        </div>
        <button @click="goBack" class="btn-ghost text-xs">{{ t('history.backToGame') }}</button>
      </div>

      <div v-if="loading" class="py-20 text-center">
        <div class="skeleton h-4 w-32 mx-auto mb-3"></div>
      </div>

      <div v-else-if="error" class="py-20 text-center">
        <p class="text-error">{{ error }}</p>
      </div>

      <div v-else-if="gameStore.rounds.length === 0" class="card p-10 text-center">
        <p class="text-text-muted text-sm">🕒 {{ t('history.noRoundsPlayed') }}</p>
      </div>

      <template v-else>
        <div class="space-y-2">
          <button
            v-for="round in sortedRounds"
            :key="round.$id"
            @click="selectRound(round)"
            class="card px-4 py-3.5 text-left w-full transition-all"
            :class="selectedRound?.$id === round.$id ? '!border-accent' : 'hover:border-border-light'"
          >
            <div class="flex items-center justify-between">
              <span class="font-heading text-sm text-text">{{ t('game.round') }} {{ round.round_number }}</span>
              <span class="tag" :class="round.status === 'revealed' ? 'tag-success' : round.status === 'writing' ? 'tag-warning' : ''">
                {{ round.status }}
              </span>
            </div>
          </button>
        </div>

        <div v-if="selectedRound" class="mt-6 pt-5 border-t border-border">
          <h2 class="font-heading text-lg text-text mb-4">{{ format('history.roundOrders', { n: selectedRound.round_number }) }}</h2>

          <div v-if="loadingOrders" class="py-10 text-center text-text-muted text-sm">{{ t('history.loadingOrders') }}</div>

          <div v-else-if="selectedOrders.length === 0" class="card p-8 text-center text-sm text-text-muted">
            {{ t('history.noOrdersInRound') }}
          </div>

          <div v-else class="space-y-2.5">
            <div v-for="order in selectedOrders" :key="order.$id" class="card px-4 py-3.5">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-base">{{ flagFor(order.power) }}</span>
                  <span class="text-sm font-medium" :style="{ color: getPowerColor(order.power) }">{{ tPowerFull(order.power) }}</span>
                </div>
                <span class="text-xs text-text-muted">{{ order.player_name }}</span>
              </div>
              <p class="font-mono text-sm text-text mb-1.5">{{ formatOrder(order) }}</p>
              <div v-if="!order.raw_text" class="flex gap-2 text-xs text-text-muted">
                <span>{{ orderIcon(order.order_type) }} {{ order.order_type }}</span>
                <span>&middot;</span>
                <span>{{ unitIcon(order.unit_type) }} {{ order.unit_type }}</span>
                <span>&middot;</span>
                <span>{{ order.origin }}</span>
                <template v-if="order.target"><span>&rarr; {{ order.target }}</span></template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
