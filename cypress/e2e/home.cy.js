describe('Home Page', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        hostname: 'fakestoreapi.com',
        pathname: '/products',
      },
      { fixture: 'products.json' },
    ).as('getProducts')
    cy.intercept(
      {
        method: 'GET',
        hostname: 'fakestoreapi.com',
        pathname: '/products',
        query: { category: '*' },
      },
      { fixture: 'products.json' },
    ).as('getProducts')
    cy.visit('/')
  })

  it('should display home page with products', () => {
    cy.wait('@getProducts', { timeout: 10000 })
    cy.contains('FakeStore').should('be.visible')
    cy.get('[data-cy="product-card"]', { timeout: 10000 }).should('have.length.at.least', 1)
  })

  it('should navigate to product detail when clicking product', () => {
    cy.wait('@getProducts', { timeout: 10000 })
    cy.intercept(
      {
        method: 'GET',
        hostname: 'fakestoreapi.com',
        pathname: '/products/1',
      },
      { fixture: 'product.json' },
    ).as('getProduct')
    cy.get('[data-cy="product-card"]', { timeout: 10000 }).first().click()
    cy.wait('@getProduct', { timeout: 10000 })
    cy.url().should('include', '/products/1')
  })

  it('should navigate to products page', () => {
    cy.wait('@getProducts', { timeout: 10000 })
    cy.contains('Products').click()
    cy.url().should('include', '/products')
  })
})
