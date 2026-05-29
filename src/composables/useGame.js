import { databases, getDatabaseId } from '@/lib/appwrite'
import { useGameStore } from '@/stores/game'
import { ID, Query } from 'appwrite'

const COLLECTIONS = {
  games: 'games',
  players: 'players',
  rounds: 'rounds',
  orders: 'orders',
}

export function useGame() {
  const dbId = getDatabaseId()
  const store = useGameStore()

  function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  async function createGame({ name, powerMode, maxPlayers, userId }) {
    const code = generateCode()
    const doc = await databases.createDocument(dbId, COLLECTIONS.games, ID.unique(), {
      code,
      name,
      status: 'waiting',
      current_round: 0,
      power_mode: powerMode,
      max_players: maxPlayers || 7,
      created_by: userId,
    })
    store.setGame(doc)
    return doc
  }

  async function getGameByCode(code) {
    const result = await databases.listDocuments(dbId, COLLECTIONS.games, [
      Query.equal('code', code),
      Query.limit(1),
    ])
    if (result.documents.length === 0) return null
    store.setGame(result.documents[0])
    return result.documents[0]
  }

  async function updateGameStatus(gameId, status) {
    const doc = await databases.updateDocument(dbId, COLLECTIONS.games, gameId, { status })
    store.setGame(doc)
    return doc
  }

  async function joinGame({ gameId, name, userId }) {
    const secret = ID.unique()
    const doc = await databases.createDocument(dbId, COLLECTIONS.players, ID.unique(), {
      game_id: gameId,
      name,
      user_id: userId,
      secret,
    })
    return { id: doc.$id, secret, name, game_id: gameId }
  }

  async function getPlayers(gameId) {
    const result = await databases.listDocuments(dbId, COLLECTIONS.players, [
      Query.equal('game_id', gameId),
      Query.orderAsc('$createdAt'),
    ])
    store.setPlayers(result.documents)
    return result.documents
  }

  async function assignPowers(assignments) {
    for (const { playerId, power } of assignments) {
      await databases.updateDocument(dbId, COLLECTIONS.players, playerId, { power })
    }
    const players = await getPlayers(store.game.$id)
    return players
  }

  async function assignRandomPowers(gameId) {
    const players = [...store.players]
    const powers = [
      'austria', 'england', 'france', 'germany',
      'italy', 'russia', 'turkey',
    ]
    const shuffled = [...powers].sort(() => Math.random() - 0.5).slice(0, players.length)

    const updates = []
    for (let i = 0; i < players.length; i++) {
      updates.push(
        databases.updateDocument(dbId, COLLECTIONS.players, players[i].$id, {
          power: shuffled[i],
        })
      )
    }
    await Promise.all(updates)
    const updated = await getPlayers(gameId)
    return updated
  }

  async function getPlayerByUserId(gameId, userId) {
    const result = await databases.listDocuments(dbId, COLLECTIONS.players, [
      Query.equal('game_id', gameId),
      Query.equal('user_id', userId),
      Query.limit(1),
    ])
    return result.documents[0] || null
  }

  return {
    COLLECTIONS,
    createGame,
    getGameByCode,
    updateGameStatus,
    joinGame,
    getPlayers,
    assignPowers,
    assignRandomPowers,
    getPlayerByUserId,
  }
}
