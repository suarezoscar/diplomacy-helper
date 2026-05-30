import { databases, getDatabaseId } from '@/lib/appwrite'
import { useGameStore } from '@/stores/game'
import { ID, Query } from 'appwrite'

export function useOrders() {
  const dbId = getDatabaseId()
  const store = useGameStore()

  async function createRound(gameId, roundNumber) {
    const doc = await databases.createDocument(dbId, 'rounds', ID.unique(), {
      game_id: gameId,
      round_number: roundNumber,
      status: 'writing',
      phase: 'orders',
    })
    store.setCurrentRound(doc)
    await databases.updateDocument(dbId, 'games', gameId, { current_round: roundNumber })
    return doc
  }

  async function getCurrentRound(gameId, roundNumber) {
    const result = await databases.listDocuments(dbId, 'rounds', [
      Query.equal('game_id', gameId),
      Query.equal('round_number', roundNumber),
      Query.limit(1),
    ])
    if (result.documents.length > 0) {
      store.setCurrentRound(result.documents[0])
      return result.documents[0]
    }
    return null
  }

  async function revealRound(roundId) {
    const doc = await databases.updateDocument(dbId, 'rounds', roundId, {
      status: 'revealed',
      phase: 'revealed',
    })
    store.setCurrentRound(doc)
    return doc
  }

  async function saveOrder(orderData) {
    if (orderData.$id) {
      return await databases.updateDocument(dbId, 'orders', orderData.$id, {
        order_type: orderData.order_type,
        unit_type: orderData.unit_type,
        origin: orderData.origin || '',
        target: orderData.target || null,
        supported_unit: orderData.supported_unit || null,
        supported_action: orderData.supported_action || null,
        raw_text: orderData.raw_text || null,
        status: orderData.status || 'draft',
      })
    }
    return await databases.createDocument(dbId, 'orders', ID.unique(), {
      round_id: orderData.round_id,
      player_id: orderData.player_id,
      player_name: orderData.player_name,
      power: orderData.power,
      order_type: orderData.order_type,
      unit_type: orderData.unit_type,
      origin: orderData.origin || '',
      target: orderData.target || null,
      supported_unit: orderData.supported_unit || null,
      supported_action: orderData.supported_action || null,
      raw_text: orderData.raw_text || null,
      status: orderData.status || 'draft',
    })
  }

  async function confirmOrder(orderId) {
    return await databases.updateDocument(dbId, 'orders', orderId, { status: 'confirmed' })
  }

  async function getMyOrders(roundId, playerId) {
    const result = await databases.listDocuments(dbId, 'orders', [
      Query.equal('round_id', roundId),
      Query.equal('player_id', playerId),
      Query.orderAsc('$createdAt'),
    ])
    store.setMyOrders(result.documents)
    return result.documents
  }

  async function getAllOrders(roundId) {
    const result = await databases.listDocuments(dbId, 'orders', [
      Query.equal('round_id', roundId),
      Query.orderAsc('$createdAt'),
    ])
    store.setAllOrders(result.documents)
    return result.documents
  }

  async function getConfirmedCount(roundId) {
    const result = await databases.listDocuments(dbId, 'orders', [
      Query.equal('round_id', roundId),
      Query.equal('status', 'confirmed'),
      Query.limit(100),
    ])
    store.setConfirmedCount(result.total)
    return result.total
  }

  async function deleteOrder(orderId) {
    await databases.deleteDocument(dbId, 'orders', orderId)
  }

  async function getRounds(gameId) {
    const result = await databases.listDocuments(dbId, 'rounds', [
      Query.equal('game_id', gameId),
      Query.orderAsc('round_number'),
    ])
    store.setRounds(result.documents)
    return result.documents
  }

  return {
    createRound,
    getCurrentRound,
    revealRound,
    saveOrder,
    confirmOrder,
    getMyOrders,
    getAllOrders,
    getConfirmedCount,
    deleteOrder,
    getRounds,
  }
}
