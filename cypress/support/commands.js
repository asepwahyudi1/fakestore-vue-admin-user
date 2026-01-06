// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (username = 'johnd', password = 'm38rmF$') => {
  cy.intercept('POST', 'https://fakestoreapi.com/auth/login', { fixture: 'auth.json' }).as('login')
  cy.intercept('GET', 'https://fakestoreapi.com/users', { fixture: 'users.json' }).as('getUsers')

  cy.visit('/login')
  cy.get('input[type="text"]').type(username)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()

  cy.wait('@login')
  cy.wait('@getUsers')
})

Cypress.Commands.add('setAuth', (userData = { id: 1, username: 'johnd' }) => {
  cy.window().then((win) => {
    win.localStorage.setItem('auth_token', 'test-token')
    win.localStorage.setItem('user_data', JSON.stringify(userData))
  })
})

Cypress.Commands.add('clearAuth', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
  })
})

Cypress.Commands.add('closeAllToasts', () => {
  cy.get('body').then(($body) => {
    const toastContainer = $body.find('[data-cy="toast-container"]')
    if (toastContainer.length > 0) {
      cy.get('[data-cy="toast-close-button"]').each(() => {
        cy.get('[data-cy="toast-close-button"]').first().click({ force: true })
      })
    }
  })
})

Cypress.Commands.add('closeAllToasts', () => {
  cy.get('body').then(($body) => {
    if ($body.find('[class*="toast"], [data-cy*="toast"]').length > 0) {
      cy.get('button').contains('×').click({ multiple: true, force: true })
    }
  })
  cy.get('body').then(($body) => {
    const closeButtons = $body.find('button[aria-label*="close"], button:has(svg[icon*="close"])')
    if (closeButtons.length > 0) {
      cy.wrap(closeButtons).each(($btn) => {
        cy.wrap($btn).click({ force: true })
      })
    }
  })
})
