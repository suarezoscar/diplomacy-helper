import { account } from '@/lib/appwrite'

export function useAnonymousSession() {
  async function ensureSession() {
    try {
      const current = await account.get()
      return current
    } catch {
      await account.createAnonymousSession()
      return account.get()
    }
  }

  async function getUserId() {
    try {
      const user = await account.get()
      return user.$id
    } catch {
      await account.createAnonymousSession()
      const user = await account.get()
      return user.$id
    }
  }

  return { ensureSession, getUserId }
}
