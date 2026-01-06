describe('Authentication', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear()
    })
    cy.visit('/login')
  })

  it('should display login form', () => {
    cy.contains('Login').should('be.visible')
    cy.get('input[type="text"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should login successfully', () => {
    cy.intercept('POST', '**/auth/login', { fixture: 'auth.json' }).as('login')
    cy.intercept('GET', '**/users', { fixture: 'users.json' }).as('getUsers')

    cy.get('input[type="text"]').type('johnd')
    cy.get('input[type="password"]').type('m38rmF$')
    cy.get('button[type="submit"]').click()

    cy.wait('@login')
    cy.wait('@getUsers')
    cy.url().should('not.include', '/login')
  })

  it('should show error on invalid credentials', () => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('Request failed with status code 401')) {
        return false
      }
      return true
    })

    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginError')

    cy.get('input[type="text"]').type('wronguser')
    cy.get('input[type="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginError')
    cy.contains('Invalid', { timeout: 2000 }).should('be.visible')
  })
})
