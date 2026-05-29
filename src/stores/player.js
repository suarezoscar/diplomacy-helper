import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const playerId = ref(localStorage.getItem('player_id') || null)
  const playerSecret = ref(localStorage.getItem('player_secret') || null)
  const playerName = ref(localStorage.getItem('player_name') || null)
  const gameId = ref(localStorage.getItem('game_id') || null)
  const userId = ref(localStorage.getItem('user_id') || null)

  const isLoggedIn = computed(() => !!playerId.value && !!playerSecret.value)

  function setPlayer({ id, secret, name, game_id, userId: uid }) {
    playerId.value = id
    playerSecret.value = secret
    playerName.value = name
    gameId.value = game_id
    userId.value = uid || userId.value
    localStorage.setItem('player_id', id)
    localStorage.setItem('player_secret', secret)
    localStorage.setItem('player_name', name)
    localStorage.setItem('game_id', game_id)
    if (uid) localStorage.setItem('user_id', uid)
  }

  function setGameId(id) {
    gameId.value = id
    localStorage.setItem('game_id', id)
  }

  function setUserId(uid) {
    userId.value = uid
    localStorage.setItem('user_id', uid)
  }

  function clear() {
    playerId.value = null
    playerSecret.value = null
    playerName.value = null
    gameId.value = null
    userId.value = null
    localStorage.removeItem('player_id')
    localStorage.removeItem('player_secret')
    localStorage.removeItem('player_name')
    localStorage.removeItem('game_id')
    localStorage.removeItem('user_id')
  }

  return { playerId, playerSecret, playerName, gameId, userId, isLoggedIn, setPlayer, setGameId, setUserId, clear }
})
