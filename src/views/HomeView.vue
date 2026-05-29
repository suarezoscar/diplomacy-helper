<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAnonymousSession } from '@/composables/useAnonymousSession'
import { useGame } from '@/composables/useGame'
import { usePlayerStore } from '@/stores/player'
import { useI18n } from '@/i18n'

const { t, format } = useI18n()
const router = useRouter()
const { ensureSession, getUserId } = useAnonymousSession()
const { createGame, getGameByCode, joinGame, getPlayerByUserId } = useGame()
const playerStore = usePlayerStore()

const tab = ref('create')
const loading = ref(false)
const error = ref('')
const createName = ref('')
const gameName = ref('')
const maxPlayers = ref(7)
const joinCode = ref('')
const joinName = ref('')

async function handleCreate() {
  if (!createName.value.trim()) {
    error.value = t('home.enterName')
    return
  }
  loading.value = true
  error.value = ''
  try {
    await ensureSession()
    const userId = await getUserId()
    const game = await createGame({
      name: gameName.value || 'Diplomacy Game',
      powerMode: 'manual',
      maxPlayers: maxPlayers.value,
      userId,
    })
    const player = await joinGame({
      gameId: game.$id,
      name: createName.value.trim(),
      userId,
    })
    playerStore.setPlayer({
      id: player.id,
      secret: player.secret,
      name: createName.value.trim(),
      game_id: game.$id,
      userId,
    })
    router.push(`/game/${game.code}`)
  } catch (e) {
    error.value = e.message || t('home.errorCreating')
  } finally {
    loading.value = false
  }
}

async function handleJoin() {
  if (!joinCode.value.trim() || !joinName.value.trim()) {
    error.value = t('home.enterCodeAndName')
    return
  }
  loading.value = true
  error.value = ''
  try {
    await ensureSession()
    const userId = await getUserId()
    const game = await getGameByCode(joinCode.value.trim().toUpperCase())
    if (!game) {
      error.value = t('home.gameNotFound')
      loading.value = false
      return
    }
    if (game.status !== 'waiting') {
      error.value = t('home.gameAlreadyStarted')
      loading.value = false
      return
    }
    const existing = await getPlayerByUserId(game.$id, userId)
    let player
    if (existing) {
      player = { id: existing.$id, secret: existing.secret, name: existing.name, game_id: game.$id, userId }
    } else {
      player = await joinGame({ gameId: game.$id, name: joinName.value.trim(), userId })
      player = { ...player, userId }
    }
    playerStore.setPlayer({
      id: player.id, secret: player.secret, name: player.name,
      game_id: game.$id, userId: player.userId,
    })
    router.push(`/game/${game.code}`)
  } catch (e) {
    error.value = e.message || t('home.errorJoining')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center px-5 py-10 min-h-[80dvh]">
    <div class="w-full max-w-sm">
      <div class="text-center mb-10">
        <div class="text-4xl mb-3">⚜</div>
        <h1 class="font-heading text-2xl text-text tracking-wide">{{ t('app.title') }}</h1>
        <p class="mt-2 text-xs text-text-muted leading-relaxed">{{ t('app.subtitle') }}</p>
      </div>

      <div class="flex rounded-xl bg-surface border border-border p-1 mb-8">
        <button
          class="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
          :class="tab === 'create' ? 'bg-accent text-base shadow-sm' : 'text-text-secondary hover:text-text'"
          @click="tab = 'create'"
        >{{ t('home.createGame') }}</button>
        <button
          class="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
          :class="tab === 'join' ? 'bg-accent text-base shadow-sm' : 'text-text-secondary hover:text-text'"
          @click="tab = 'join'"
        >{{ t('home.joinGame') }}</button>
      </div>

      <div v-if="error" class="tag tag-error mb-5 px-4 py-3 w-full text-sm rounded-lg">{{ error }}</div>

      <form v-if="tab === 'create'" @submit.prevent="handleCreate" class="space-y-4">
        <div>
          <label class="block text-xs text-text-secondary mb-1.5 ml-1">{{ t('home.yourName') }}</label>
          <input v-model="createName" type="text" placeholder="e.g. Oscar" />
        </div>
        <div>
          <label class="block text-xs text-text-secondary mb-1.5 ml-1">{{ t('home.gameName') }}</label>
          <input v-model="gameName" type="text" :placeholder="t('home.gameNamePlaceholder')" />
        </div>
        <div>
          <label class="block text-xs text-text-secondary mb-1.5 ml-1">{{ t('home.maxPlayers') }}</label>
          <select v-model.number="maxPlayers">
            <option v-for="n in 6" :key="n + 1" :value="n + 1">{{ format('home.playersCount', { n: n + 1 }) }}</option>
          </select>
        </div>
        <button type="submit" :disabled="loading" class="btn-primary w-full py-3">
          {{ loading ? t('home.creating') : t('home.createGame') }}
        </button>
      </form>

      <form v-if="tab === 'join'" @submit.prevent="handleJoin" class="space-y-4">
        <div>
          <label class="block text-xs text-text-secondary mb-1.5 ml-1">{{ t('home.code') }}</label>
          <input v-model="joinCode" type="text" placeholder="e.g. ABC123" class="uppercase !font-mono !tracking-widest" />
        </div>
        <div>
          <label class="block text-xs text-text-secondary mb-1.5 ml-1">{{ t('home.yourName') }}</label>
          <input v-model="joinName" type="text" placeholder="e.g. Anna" />
        </div>
        <button type="submit" :disabled="loading" class="btn-primary w-full py-3">
          {{ loading ? t('home.joining') : t('home.joinGame') }}
        </button>
      </form>
    </div>
  </div>
</template>
