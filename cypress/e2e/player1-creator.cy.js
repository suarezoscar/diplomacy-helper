describe('Diplomacy Helper — Full Game Flow', () => {

  it('complete multiplayer end-to-end flow', () => {
    let game, player2

    // ================================================================
    // 1. Create the game as Oscar
    // ================================================================
    cy.visit('/')
    cy.get('h1').should('contain.text', 'Diplomacy Helper')
    cy.get('input[placeholder="e.g. Oscar"]').type('Oscar')
    cy.get('form select').select('3')
    cy.get('form').first().submit()

    cy.url().should('match', /\/game\/[A-Z0-9]{6}$/)
    cy.contains('Oscar').should('be.visible')
    cy.contains('Vestíbulo').should('be.visible')

    // Fetch game data and join Anna — chain sequentially
    cy.url().then((url) => {
      const code = url.match(/\/game\/([A-Z0-9]{6})$/)[1]
      cy.task('saveGameCode', code)

      return cy.task('getGameByCode', code)
    }).then((g) => {
      game = g
      cy.log(`Game: ${game.$id} / ${game.code}`)

      // 2. Join Anna via API
      return cy.task('createAnonymousSession')
    }).then((session) => {
      return cy.task('createPlayer', {
        gameId: game.$id,
        name: 'Anna',
        userId: session.userId,
      })
    }).then((p) => {
      player2 = p
      cy.log(`Anna joined: ${player2.$id}`)
    })

    // ================================================================
    // 3. Assign powers as Oscar
    // ================================================================
    cy.task('getGameCode').then((code) => {
      cy.visit(`/#/game/${code}`)
    })

    cy.contains('Anna', { timeout: 15000 }).should('be.visible')
    cy.contains('Oscar').should('be.visible')

    cy.contains('button', 'Asignar potencias').click()
    cy.contains('Aplicar asignaciones').parent().within(() => {
      cy.get('select').eq(0).select('austria')
      cy.get('select').eq(1).select('england')
    })
    cy.contains('button', 'Aplicar asignaciones').click()

    cy.contains(/Austria-Hungría/i, { timeout: 15000 }).should('be.visible')
    cy.contains(/Inglaterra/i).should('be.visible')

    // ================================================================
    // 4. Start the game
    // ================================================================
    cy.contains('button', 'Iniciar partida').should('not.be.disabled').click()

    cy.url({ timeout: 20000 }).should('include', '/play')
    cy.contains(/Ronda 1/i, { timeout: 20000 }).should('be.visible')
    cy.contains('Tus órdenes').should('be.visible')

    // ================================================================
    // 5. Write orders as Oscar (free text)
    // ================================================================
    cy.contains('button', 'Texto libre').click()
    cy.get('textarea').should('be.visible').type('A VIE - BUD{enter}F TRI H')
    cy.contains('Confirmar todas las órdenes').click()
    cy.contains('Confirmada', { timeout: 15000 }).should('be.visible')
    cy.contains('A VIE - BUD').should('be.visible')
    cy.contains('F TRI H').should('be.visible')

    // ================================================================
    // 6. Write Anna's orders via API
    // ================================================================
    cy.then(() => {
      return cy.task('getRound', { gameId: game.$id, roundNumber: 1 })
    }).then((round) => {
      return cy.task('createOrder', {
        round_id: round.$id,
        player_id: player2.$id,
        player_name: 'Anna',
        power: 'england',
        order_type: 'move',
        unit_type: 'fleet',
        origin: 'LON',
        target: 'NTH',
        status: 'confirmed',
      })
    })

    // ================================================================
    // 7. Reveal orders
    // ================================================================
    cy.contains('button', 'Revelar órdenes', { timeout: 15000 }).click()
    cy.contains('Revelado', { timeout: 15000 }).should('be.visible')
    cy.contains('A VIE - BUD').should('be.visible')
    cy.contains('F TRI H').should('be.visible')

    // ================================================================
    // 8. Advance to round 2 and complete it solo
    // ================================================================
    cy.contains('button', 'Ronda siguiente').click()
    cy.contains(/Ronda 2/i, { timeout: 20000 }).should('be.visible')
    cy.contains('Tus órdenes').should('be.visible')

    cy.contains('button', 'Texto libre').click()
    cy.get('textarea').should('be.visible').type('A BUD - VIE{enter}F TRI - ALB')
    cy.contains('Confirmar todas las órdenes').click()
    cy.contains('Confirmada', { timeout: 15000 }).should('be.visible')

    cy.contains('button', 'Revelar órdenes').click()
    cy.contains('Revelado', { timeout: 15000 }).should('be.visible')
    cy.contains('A BUD - VIE').should('be.visible')
    cy.contains('F TRI - ALB').should('be.visible')

    // ================================================================
    // 9. Check order history
    // ================================================================
    cy.contains('button', 'Historial').click()
    cy.url().should('include', '/history')
    cy.contains('Historial de órdenes', { timeout: 15000 }).should('be.visible')

    cy.contains(/Ronda 2/i).should('be.visible')
    cy.contains(/Ronda 1/i).should('be.visible')

    cy.contains(/Ronda 1/i).click()
    cy.contains('Órdenes', { timeout: 15000 }).should('be.visible')
    cy.contains('A VIE - BUD').should('be.visible')
    cy.contains('F TRI H').should('be.visible')
  })
})
