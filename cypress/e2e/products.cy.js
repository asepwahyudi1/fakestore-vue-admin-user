describe('Products Page', () => {
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
    cy.intercept(
      {
        method: 'GET',
        hostname: 'fakestoreapi.com',
        pathname: '/products/categories',
      },
      ['electronics', "men's clothing", "women's clothing", 'jewelery'],
    ).as('getCategories')
    cy.visit('/products')
  })

  it('should display products list', () => {
    cy.wait('@getProducts', { timeout: 10000 })
    cy.wait('@getCategories', { timeout: 10000 })
    cy.get('[data-cy="products-title"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-cy="products-card"]', { timeout: 10000 }).should('have.length.at.least', 1)
  })

  it('should filter products by category', () => {
    cy.wait('@getProducts', { timeout: 10000 })
    cy.wait('@getCategories', { timeout: 10000 })
    cy.get('select', { timeout: 10000 }).should('be.visible')

    cy.intercept(
      {
        method: 'GET',
        hostname: 'fakestoreapi.com',
        pathname: '/products/category/**',
      },
      { fixture: 'products.json' },
    ).as('getProductsByCategory')

    cy.get('select').select("men's clothing")
    cy.wait('@getProductsByCategory', { timeout: 10000 })
    cy.get('[data-cy="products-card"]', { timeout: 10000 }).should('have.length.at.least', 1)
  })

  it('should search products', () => {
    cy.wait('@getProducts', { timeout: 10000 })
    cy.wait('@getCategories', { timeout: 10000 })
    cy.get('input[type="text"]', { timeout: 10000 }).should('be.visible')
    cy.get('input[type="text"]').type('Backpack')
    cy.get('[data-cy="products-card"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[data-cy="products-card"]').first().should('contain', 'Backpack')
  })

  it('should navigate to product detail page', () => {
    cy.wait('@getProducts', { timeout: 10000 })
    cy.intercept(
      {
        method: 'GET',
        hostname: 'fakestoreapi.com',
        pathname: '/products/1',
      },
      { fixture: 'product.json' },
    ).as('getProduct')
    cy.get('[data-cy="products-card"]', { timeout: 10000 }).first().click()
    cy.wait('@getProduct', { timeout: 10000 })
    cy.url().should('include', '/products/1')
    cy.contains('Fjallraven - Foldsack No. 1 Backpack').should('be.visible')
  })
})
