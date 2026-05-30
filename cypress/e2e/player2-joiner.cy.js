describe('Player 2 (Joiner) — UI Tests', () => {

  before(() => {
    cy.session('player2', () => {
      cy.visit('/')
      cy.get('h1', { timeout: 20000 }).should('be.visible')
    })
  })

  it('joins a game via UI', () => {
    cy.task('getGameCode').then((code) => {
      cy.visit('/')
      cy.get('h1').should('contain.text', 'Diplomacy Helper')

      cy.contains('button', 'Unirse a partida').click()
      cy.get('input[placeholder="e.g. ABC123"]').type(code)
      cy.get('input[placeholder="e.g. Anna"]').type('Anna')
      cy.get('form').first().submit()

      cy.contains('Anna', { timeout: 10000 }).should('be.visible')
      cy.contains(/esperando.*creador/i).should('be.visible')
    })
  })

  it('sees lobby after joining with players listed', () => {
    cy.task('getGameCode').then((code) => {
      cy.visit(`/#/game/${code}`)
    })

    cy.contains('Anna', { timeout: 15000 }).should('be.visible')
  })
})
