import { defineConfig } from 'cypress'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'

const CODE_FILE = '/tmp/cypress-game-code.txt'
const ENDPOINT = 'https://fra.cloud.appwrite.io/v1'
const PROJECT = '6a198d760032c2e8db69'
const DB = '6a19b8050037bbd0060c'
const KEY = 'standard_c31537ead4e3ff0bab240e266d5104ae79cc98f1df5c39c6d382521882d1422d9d41a4cae28f20224e308728ef1cb322d354506512bfb63a2484474b02cb8be6b9024247653916e56300ba266eed9b608b9b6cdb780a60281a6ab5a5e077877f6dcbe5daceb84b3a6a797e7cb7d41f025e304c6bcbea296f2ffd5ce57a85e65a'

async function appwrite(method, path, body = null) {
  const opts = {
    method,
    headers: {
      'X-Appwrite-Project': PROJECT,
      'X-Appwrite-Key': KEY,
    },
  }
  if (body) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(`${ENDPOINT}${path}`, opts)
  const json = await res.json()
  if (res.status >= 400) throw new Error(`Appwrite ${method} ${path}: ${res.status} ${json.message || JSON.stringify(json)}`)
  return json
}

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    chromeWebSecurity: false,
    retries: { runMode: 1, openMode: 0 },
    setupNodeEvents(on) {
      on('task', {
        saveGameCode(code) {
          writeFileSync(CODE_FILE, code, 'utf-8')
          return null
        },
        getGameCode() {
          if (!existsSync(CODE_FILE)) throw new Error('No game code — run creator spec first')
          return readFileSync(CODE_FILE, 'utf-8')
        },

        // Appwrite API helpers via cy.task
        async getGameByCode(code) {
          const q = encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'code', values: [code] }))
          const q2 = encodeURIComponent(JSON.stringify({ method: 'limit', values: [1] }))
          const data = await appwrite('GET', `/databases/${DB}/collections/games/documents?queries[0]=${q}&queries[1]=${q2}`)
          return data.documents[0] || null
        },
        async createPlayer({ gameId, name, userId }) {
          const doc = await appwrite('POST', `/databases/${DB}/collections/players/documents`, {
            documentId: 'unique()',
            data: { game_id: gameId, name, user_id: userId, secret: 'unique()' },
          })
          return doc
        },
        async createAnonymousSession() {
          const session = await appwrite('POST', '/account/sessions/anonymous')
          return session
        },
        async getRound({ gameId, roundNumber }) {
          const q1 = encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'game_id', values: [gameId] }))
          const q2 = encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'round_number', values: [roundNumber] }))
          const q3 = encodeURIComponent(JSON.stringify({ method: 'limit', values: [1] }))
          const data = await appwrite('GET', `/databases/${DB}/collections/rounds/documents?queries[0]=${q1}&queries[1]=${q2}&queries[2]=${q3}`)
          return data.documents[0] || null
        },
        async createOrder(orderData) {
          const doc = await appwrite('POST', `/databases/${DB}/collections/orders/documents`, {
            documentId: 'unique()',
            data: orderData,
          })
          return doc
        },
        async getPlayer(playerId) {
          return await appwrite('GET', `/databases/${DB}/collections/players/documents/${playerId}`)
        },
      })
    },
  },
})
