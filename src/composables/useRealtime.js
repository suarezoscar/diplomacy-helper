import { client, getDatabaseId } from '@/lib/appwrite'
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'
import { useOrders } from './useOrders'
import { ref, onUnmounted } from 'vue'

export function useRealtime() {
  const store = useGameStore()
  const dbId = getDatabaseId()
  const subscriptions = ref([])

  function subscribeToPlayers(gameId) {
    const sub = client.subscribe(
      `databases.${dbId}.collections.players.documents`,
      (response) => {
        const payload = response.payload
        if (payload.game_id !== gameId) return

        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          store.addPlayer(payload)
        }
        if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          store.updatePlayer(payload.$id, payload)
        }
      }
    )
    subscriptions.value.push(sub)
    return sub
  }

  function subscribeToGame(gameId) {
    const sub = client.subscribe(
      `databases.${dbId}.collections.games.documents.${gameId}`,
      (response) => {
        if (
          response.events.includes('databases.*.collections.*.documents.*.update')
        ) {
          store.setGame(response.payload)
        }
      }
    )
    subscriptions.value.push(sub)
    return sub
  }

  function subscribeToRounds(gameId) {
    const { getAllOrders, getMyOrders } = useOrders()
    const sub = client.subscribe(
      `databases.${dbId}.collections.rounds.documents`,
      (response) => {
        const payload = response.payload
        if (payload.game_id !== gameId) return

        if (
          response.events.includes('databases.*.collections.*.documents.*.create') &&
          payload.status === 'writing'
        ) {
          store.setCurrentRound(payload)
          store.setMyOrders([])
          store.setAllOrders([])
          store.setConfirmedCount(0)
          const ps = usePlayerStore()
          if (ps.playerId) {
            getMyOrders(payload.$id, ps.playerId)
          }
          subscribeToOrders(payload.$id, ps.playerId)
        }

        if (
          response.events.includes('databases.*.collections.*.documents.*.update') &&
          payload.status === 'revealed'
        ) {
          store.setCurrentRound(payload)
          getAllOrders(payload.$id)
        }
      }
    )
    subscriptions.value.push(sub)
    return sub
  }

  function subscribeToOrders(roundId, playerId) {
    const { getConfirmedCount } = useOrders()
    const sub = client.subscribe(
      `databases.${dbId}.collections.orders.documents`,
      (response) => {
        const payload = response.payload
        if (payload.round_id !== roundId) return

        if (payload.player_id === playerId) {
          store.setMyOrders(
            store.myOrders
              .filter((o) => o.$id !== payload.$id)
              .concat(payload)
              .sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt))
          )
        }

        if (
          response.events.includes('databases.*.collections.*.documents.*.update') &&
          payload.status === 'confirmed'
        ) {
          getConfirmedCount(roundId)
        }
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          getConfirmedCount(roundId)
        }
      }
    )
    subscriptions.value.push(sub)
    return sub
  }

  function unsubscribeAll() {
    subscriptions.value.forEach((s) => {
      try {
        s()
      } catch {
        /* ignore unsubscribe errors */
      }
    })
    subscriptions.value = []
  }

  onUnmounted(() => {
    unsubscribeAll()
  })

  return { subscribeToPlayers, subscribeToGame, subscribeToRounds, subscribeToOrders, unsubscribeAll }
}
