<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import { useAnonymousSession } from '@/composables/useAnonymousSession'
import { useGame } from '@/composables/useGame'
import { useRealtime } from '@/composables/useRealtime'
import { useI18n } from '@/i18n'
import { flagFor } from '@/constants/icons'
import PlayerList from '@/components/PlayerList.vue'
import PowerAssignment from '@/components/PowerAssignment.vue'

const { t, format, tPowerFull } = useI18n()
const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const gameStore = useGameStore()
const { ensureSession, getUserId } = useAnonymousSession()
const { getGameByCode, getPlayers, getPlayerByUserId, joinGame, assignPowers, assignRandomPowers, updateGameStatus } = useGame()
const { subscribeToPlayers, subscribeToGame } = useRealtime()

const loading = ref(true)
const error = ref('')
const showPowerAssignment = ref(false)
const assigningRandom = ref(false)
const copied = ref(false)
const needsJoin = ref(false)
const joinName = ref('')
const joining = ref(false)

const gameCode = computed(() => route.params.code)
const shareLink = computed(() => `${window.location.origin}/#/game/${gameCode.value}`)

onMounted(async () => {
  try {
    await ensureSession()
    const userId = await getUserId()
    const code = gameCode.value

    const game = await getGameByCode(code)
    if (!game) { error.value = t('common.gameNotFound'); loading.value = false; return }

    const existing = await getPlayerByUserId(game.$id, userId)
    if (existing) {
      playerStore.setPlayer({
        id: existing.$id, secret: existing.secret, name: existing.name,
        game_id: game.$id, userId,
      })
    } else if (game.status === 'waiting') {
      await getPlayers(game.$id)
      subscribeToPlayers(game.$id)
      needsJoin.value = true
      loading.value = false
      return
    } else {
      error.value = t('common.gameAlreadyStarted')
      loading.value = false
      return
    }

    if (playerStore.gameId !== game.$id) playerStore.setGameId(game.$id)
    await getPlayers(game.$id)
    subscribeToPlayers(game.$id)
    subscribeToGame(game.$id)

    if (game.status === 'active') { router.replace(`/game/${code}/play`); return }
  } catch (e) {
    error.value = e.message || 'Error'
  } finally {
    loading.value = false
  }
})

const isCreator = computed(() => gameStore.isCreator)
const allPowersReady = computed(() => gameStore.allPowersAssigned)

const myPowerInfo = computed(() => {
  const p = gameStore.myPlayer
  if (!p || !p.power) return null
  return { id: p.power, flag: flagFor(p.power), name: tPowerFull(p.power) }
})

watch(
  () => gameStore.game?.status,
  (status) => { if (status === 'active' && !isCreator.value) router.push(`/game/${gameCode.value}/play`) }
)

function copyLink() {
  navigator.clipboard.writeText(shareLink.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

async function handleRandomAssign() {
  assigningRandom.value = true
  try { await assignRandomPowers(gameStore.game.$id) } finally { assigningRandom.value = false }
}

async function handleAssignPowers(assignments) { await assignPowers(assignments) }

async function handleStartGame() {
  if (!gameStore.players.every((p) => p.power)) { error.value = t('lobby.assignAllPowers'); return }
  loading.value = true
  try {
    await updateGameStatus(gameStore.game.$id, 'active')
    router.push(`/game/${gameCode.value}/play`)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleJoinGame() {
  if (!joinName.value.trim()) { error.value = t('lobby.enterYourName'); return }
  joining.value = true; error.value = ''
  try {
    const userId = playerStore.userId || await getUserId()
    const player = await joinGame({ gameId: gameStore.game.$id, name: joinName.value.trim(), userId })
    playerStore.setPlayer({ id: player.id, secret: player.secret, name: joinName.value.trim(), game_id: gameStore.game.$id, userId })
    needsJoin.value = false
    await getPlayers(gameStore.game.$id)
    subscribeToGame(gameStore.game.$id)
  } catch (e) {
    error.value = e.message || 'Error joining game'
  } finally {
    joining.value = false
  }
}

function handleLeave() { playerStore.clear(); router.push('/') }
</script>

<template>
  <div class="flex flex-col items-center px-4 py-6">
    <div class="w-full max-w-lg">
      <div v-if="loading" class="py-20 text-center">
        <div class="skeleton h-4 w-32 mx-auto mb-3"></div>
        <div class="skeleton h-3 w-48 mx-auto"></div>
      </div>

      <div v-else-if="needsJoin" class="text-center">
        <h1 class="font-heading text-xl text-text mb-1">{{ gameStore.game?.name || 'Diplomacy Game' }}</h1>
        <p class="text-xs text-text-muted mb-5">{{ format('lobby.playersReady', { current: gameStore.players.length, max: gameStore.game?.max_players || 7 }) }}</p>
        <PlayerList class="mb-6" />

        <div v-if="error" class="tag tag-error mb-4 px-4 py-3 w-full text-sm rounded-lg">{{ error }}</div>

        <form v-if="gameStore.players.length < (gameStore.game?.max_players || 7)" @submit.prevent="handleJoinGame" class="space-y-3 max-w-xs mx-auto">
          <p class="text-sm text-text-secondary">{{ t('lobby.joinGame') }}</p>
          <input v-model="joinName" type="text" :placeholder="t('lobby.enterYourName')" />
          <button type="submit" :disabled="joining" class="btn-primary w-full py-3">{{ joining ? t('home.joining') : t('lobby.joinGame') }}</button>
        </form>
        <p v-else class="text-sm text-text-muted mt-4">{{ t('lobby.gameFull') }}</p>
        <button @click="router.push('/')" class="btn-ghost mt-6">{{ t('common.backToHome') }}</button>
      </div>

      <div v-else-if="error" class="py-20 text-center">
        <p class="text-error mb-4">{{ error }}</p>
        <button @click="router.push('/')" class="btn-ghost">{{ t('common.backToHome') }}</button>
      </div>

      <template v-else>
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div class="min-w-0">
              <h1 class="font-heading text-xl text-text truncate">{{ gameStore.game?.name || 'Diplomacy Game' }}</h1>
              <div class="flex items-center gap-2 mt-1">
                <span class="tag tag-warning text-[10px]">{{ t('lobby.title') }}</span>
                <span v-if="myPowerInfo" class="text-xs text-text-muted">
                  {{ myPowerInfo.flag }} {{ myPowerInfo.name }}
                </span>
              </div>
            </div>
            <button @click="handleLeave" class="btn-ghost shrink-0">{{ t('lobby.leave') }}</button>
          </div>
        </div>

        <div class="card p-4 mb-5">
          <p class="text-[11px] text-text-muted mb-2">{{ t('lobby.shareLink') }}</p>
          <div class="flex gap-2">
            <input :value="shareLink" readonly class="!text-xs !font-mono !py-2" />
            <button @click="copyLink" class="btn-secondary shrink-0 !text-xs !px-3">{{ copied ? t('lobby.copied') : t('lobby.copy') }}</button>
          </div>
          <p class="mt-2 text-[11px] text-text-muted">{{ t('lobby.code') }}: <span class="text-text-secondary font-mono tracking-widest">{{ gameCode }}</span></p>
        </div>

        <PlayerList />

        <div v-if="isCreator" class="mt-5 space-y-3">
          <div class="flex gap-2">
            <button @click="showPowerAssignment = !showPowerAssignment" class="btn-secondary flex-1 py-2.5 text-sm">
              {{ showPowerAssignment ? t('lobby.hideAssignments') : t('lobby.assignPowers') }}
            </button>
            <button @click="handleRandomAssign" :disabled="assigningRandom" class="btn-secondary py-2.5 text-sm">
              {{ assigningRandom ? '...' : t('lobby.random') }}
            </button>
          </div>

          <PowerAssignment v-if="showPowerAssignment" @assign="handleAssignPowers" />

          <button @click="handleStartGame" :disabled="gameStore.players.length < 2 || !allPowersReady" class="btn-primary w-full py-3.5 text-base">
            {{ t('lobby.startGame') }}
            <span class="block text-xs opacity-70 mt-0.5 font-normal">
              <template v-if="gameStore.players.length < 2">{{ t('lobby.needAtLeast2') }}</template>
              <template v-else-if="!allPowersReady">{{ t('lobby.assignAllPowers') }}</template>
              <template v-else>{{ format('lobby.playersReady', { current: gameStore.players.length, max: gameStore.game?.max_players || 7 }) }}</template>
            </span>
          </button>
        </div>

        <div v-else class="mt-5 card p-5 text-center">
          <p class="text-sm text-text-muted">{{ t('lobby.waitingCreator') }}</p>
        </div>
      </template>
    </div>
  </div>
</template>
