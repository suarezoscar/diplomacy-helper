import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { POWERS } from '@/constants/diplomacy'
import { usePlayerStore } from '@/stores/player'

export const useGameStore = defineStore('game', () => {
  const game = ref(null)
  const players = ref([])
  const rounds = ref([])
  const currentRound = ref(null)
  const myOrders = ref([])
  const allOrders = ref([])
  const confirmedCount = ref(0)

  const isCreator = computed(() => {
    if (!game.value) return false
    const ps = usePlayerStore()
    return game.value.created_by === ps.userId
  })

  const myPlayer = computed(() => {
    const ps = usePlayerStore()
    return players.value.find((p) => p.$id === ps.playerId) || null
  })

  const myPower = computed(() => {
    return myPlayer.value?.power || null
  })

  const allConfirmed = computed(() => {
    if (!currentRound.value) return false
    return confirmedCount.value >= players.value.length && players.value.length > 0
  })

  const assignedPowers = computed(() => {
    return players.value.filter((p) => p.power).map((p) => p.power)
  })

  const allPowersAssigned = computed(() => {
    if (players.value.length < 2) return false
    return players.value.every((p) => p.power)
  })

  const availablePowers = computed(() => {
    return POWERS.filter((p) => !assignedPowers.value.includes(p.id))
  })

  function setGame(g) {
    game.value = g
  }

  function setPlayers(list) {
    players.value = list
  }

  function addPlayer(p) {
    if (!players.value.find((pl) => pl.$id === p.$id)) {
      players.value.push(p)
    }
  }

  function updatePlayer(id, data) {
    const idx = players.value.findIndex((p) => p.$id === id)
    if (idx !== -1) {
      players.value[idx] = { ...players.value[idx], ...data }
    }
  }

  function setRounds(list) {
    rounds.value = list
  }

  function setCurrentRound(r) {
    currentRound.value = r
  }

  function setMyOrders(orders) {
    myOrders.value = orders
  }

  function setAllOrders(orders) {
    allOrders.value = orders
  }

  function setConfirmedCount(n) {
    confirmedCount.value = n
  }

  function getPlayerPower(playerId) {
    const p = players.value.find((pl) => pl.$id === playerId)
    return p ? p.power : null
  }

  function getPowerName(powerId) {
    const p = POWERS.find((pw) => pw.id === powerId)
    return p ? p.name : powerId
  }

  return {
    game,
    players,
    rounds,
    currentRound,
    myOrders,
    allOrders,
    confirmedCount,
    isCreator,
    myPlayer,
    myPower,
    allConfirmed,
    allPowersAssigned,
    assignedPowers,
    availablePowers,
    setGame,
    setPlayers,
    addPlayer,
    updatePlayer,
    setRounds,
    setCurrentRound,
    setMyOrders,
    setAllOrders,
    setConfirmedCount,
    getPlayerPower,
    getPowerName,
  }
})
