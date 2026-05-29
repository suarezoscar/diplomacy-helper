<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import { useAnonymousSession } from '@/composables/useAnonymousSession'
import { useGame } from '@/composables/useGame'
import { useOrders } from '@/composables/useOrders'
import { useRealtime } from '@/composables/useRealtime'
import { useI18n } from '@/i18n'
import { flagFor } from '@/constants/icons'
import OrderForm from '@/components/OrderForm.vue'
import OrdersReveal from '@/components/OrdersReveal.vue'
import RoundHeader from '@/components/RoundHeader.vue'

const { t, format, tPowerFull } = useI18n()
const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const gameStore = useGameStore()
const { ensureSession, getUserId } = useAnonymousSession()
const { getGameByCode, getPlayers } = useGame()
const { createRound, getCurrentRound, revealRound, getMyOrders, getAllOrders, getConfirmedCount } = useOrders()
const { subscribeToPlayers, subscribeToRounds, subscribeToOrders } = useRealtime()

const loading = ref(true)
const error = ref('')
const gameCode = computed(() => route.params.code)

onMounted(async () => {
  try {
    await ensureSession()
    await getUserId()
    const code = gameCode.value

    if (!playerStore.playerId) { router.push(`/game/${code}`); return }

    const game = await getGameByCode(code)
    if (!game) { error.value = t('common.gameNotFound'); loading.value = false; return }
    if (game.status === 'waiting') { router.replace(`/game/${code}`); return }

    await getPlayers(game.$id)

    const roundNumber = game.current_round || 0
    let round
    if (roundNumber > 0) round = await getCurrentRound(game.$id, roundNumber)

    if (!round || round.status === 'revealed') {
      const nextRound = roundNumber + 1
      if (gameStore.isCreator && (!round || round.status === 'revealed')) {
        round = await createRound(game.$id, nextRound)
        await getAllOrders(round.$id)
      } else {
        round = await getCurrentRound(game.$id, nextRound)
      }
    }

    if (round) {
      if (round.status === 'writing') { await getMyOrders(round.$id, playerStore.playerId); await getConfirmedCount(round.$id) }
      else if (round.status === 'revealed') { await getAllOrders(round.$id) }
    }

    subscribeToPlayers(game.$id)
    if (round) subscribeToOrders(round.$id, playerStore.playerId)
    subscribeToRounds(game.$id)
  } catch (e) { error.value = e.message || 'Error' } finally { loading.value = false }
})

const roundPhase = computed(() => gameStore.currentRound?.status || 'writing')
const isRevealed = computed(() => roundPhase.value === 'revealed')

async function handleReveal() {
  if (!gameStore.currentRound) return
  loading.value = true
  try { await revealRound(gameStore.currentRound.$id); await getAllOrders(gameStore.currentRound.$id) } catch (e) { error.value = e.message } finally { loading.value = false }
}

async function handleNextRound() {
  if (!gameStore.game || !gameStore.currentRound) return
  loading.value = true
  try {
    const nextNumber = gameStore.currentRound.round_number + 1
    const round = await createRound(gameStore.game.$id, nextNumber)
    gameStore.setMyOrders([]); gameStore.setAllOrders([]); gameStore.setConfirmedCount(0)
    await getMyOrders(round.$id, playerStore.playerId)
    subscribeToOrders(round.$id, playerStore.playerId)
  } catch (e) { error.value = e.message } finally { loading.value = false }
}

function handleBack() { router.push(`/game/${gameCode.value}`) }
</script>

<template>
  <div class="flex flex-col items-center px-4 py-5">
    <div class="w-full max-w-2xl">
      <div v-if="loading" class="py-20 text-center">
        <div class="skeleton h-4 w-32 mx-auto mb-3"></div>
        <div class="skeleton h-3 w-48 mx-auto"></div>
      </div>

      <div v-else-if="error" class="py-20 text-center">
        <p class="text-error mb-4">{{ error }}</p>
        <button @click="handleBack" class="btn-ghost">{{ t('game.back') }}</button>
      </div>

      <template v-else>
        <div class="flex items-center justify-between mb-5">
          <div class="min-w-0">
            <h1 class="font-heading text-lg text-text truncate">{{ gameStore.game?.name }}</h1>
            <p class="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
              <span>{{ flagFor(gameStore.myPower) || '?' }}</span>
              <span :style="{ color: gameStore.myPower ? 'inherit' : 'var(--color-text-muted)' }">
                {{ tPowerFull(gameStore.myPower) || t('game.unassigned') }}
              </span>
              <span>&mdash;</span>
              <span>{{ playerStore.playerName }}</span>
            </p>
          </div>
          <div class="flex gap-1.5 shrink-0">
            <button @click="router.push(`/game/${gameCode}/history`)" class="btn-ghost text-xs">📋 {{ t('game.history') }}</button>
            <button @click="handleBack" class="btn-ghost text-xs">{{ t('game.lobby') }}</button>
          </div>
        </div>

        <RoundHeader />

        <div v-if="!isRevealed" class="mt-5">
          <OrderForm />
        </div>

        <OrdersReveal v-if="isRevealed && gameStore.allOrders.length > 0" />

        <div v-if="gameStore.isCreator && gameStore.currentRound" class="mt-6 pt-5 border-t border-border">
          <div v-if="!isRevealed" class="flex items-center justify-between">
            <p class="text-sm text-text-muted flex items-center gap-1.5">
              <span>👥</span>
              {{ format('game.confirmedCount', { count: gameStore.confirmedCount, total: gameStore.players.length }) }}
            </p>
            <button @click="handleReveal" :disabled="!gameStore.allConfirmed || loading" class="btn-primary py-2.5 px-6">
              {{ loading ? '...' : t('game.revealOrders') }}
            </button>
          </div>
          <button v-else @click="handleNextRound" :disabled="loading" class="btn-secondary w-full py-3 text-sm">
            {{ loading ? t('game.creatingRound') : t('game.nextRound') }}
          </button>
        </div>

        <div v-if="!gameStore.isCreator && !isRevealed && gameStore.currentRound" class="mt-6 pt-5 border-t border-border text-center">
          <p class="text-sm text-text-muted">\u23F3 {{ t('game.waitingCreatorReveal') }}</p>
        </div>
      </template>
    </div>
  </div>
</template>
