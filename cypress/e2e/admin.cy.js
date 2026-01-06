describe('Admin Pages', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('windowAlert')
    })

    cy.on('uncaught:exception', (err) => {
      if (
        err.message &&
        err.message.toLowerCase().includes('change') &&
        err.message.toLowerCase().includes('password')
      ) {
        return false
      }
      return true
    })

    cy.closeAllToasts()

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
        pathname: '/users',
      },
      { fixture: 'users.json' },
    ).as('getUsers')
    cy.intercept(
      {
        method: 'GET',
        hostname: 'fakestoreapi.com',
        pathname: '/carts/user/1',
      },
      { body: [] },
    ).as('getUserCart')

    cy.login('johnd', 'm38rmF$')
  })

  it('should access admin dashboard', () => {
    cy.visit('/admin/dashboard')
    cy.url({ timeout: 10000 }).should('include', '/admin/dashboard')
    cy.wait('@getProducts', { timeout: 10000 })
    cy.wait('@getUsers', { timeout: 10000 })
    cy.get('[data-cy="admin-dashboard"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-cy="total-products-value"]', { timeout: 10000 })
      .should('be.visible')
      .should('not.contain', '-')
    cy.get('[data-cy="total-users-value"]', { timeout: 10000 })
      .should('be.visible')
      .should('not.contain', '-')
    cy.get('[data-cy="total-products-value"]').should('not.be.empty')
    cy.get('[data-cy="total-users-value"]').should('not.be.empty')
  })

  it('should display admin products page', () => {
    cy.visit('/admin/products')
    cy.wait('@getProducts')
    cy.get('[data-cy="add-product-button"]', { timeout: 5000 }).should('be.visible')
    cy.get('[data-cy="product-row"]').should('have.length', 3)
  })

  it('should create new product', () => {
    cy.visit('/admin/products')
    cy.wait('@getProducts')

    cy.intercept('POST', 'https://fakestoreapi.com/products', {
      statusCode: 201,
      body: { id: 4, title: 'New Product', price: 99.99 },
    }).as('createProduct')

    cy.get('[data-cy="add-product-button"]').click()
    cy.get('[data-cy="product-form"]', { timeout: 5000 }).should('be.visible')
    cy.get('[data-cy="product-title-input"]').type('New Product')
    cy.get('[data-cy="product-price-input"]').type('99.99')
    cy.get('[data-cy="product-description-input"]').type('Test description')
    cy.get('[data-cy="product-category-input"]').type('electronics')
    cy.get('[data-cy="product-image-input"]').type('https://example.com/image.jpg')
    cy.get('[data-cy="product-form-submit-button"]').click()
    cy.wait('@createProduct')
    cy.contains('Product created successfully', { timeout: 5000 }).should('be.visible')
  })

  it('should update product', () => {
    cy.visit('/admin/products')
    cy.wait('@getProducts')

    cy.intercept('PUT', 'https://fakestoreapi.com/products/1', {
      statusCode: 200,
      body: { id: 1, title: 'Updated Product', price: 199.99 },
    }).as('updateProduct')

    cy.get('[data-cy="product-row"]').first().find('[data-cy="product-edit-button"]').click()
    cy.get('[data-cy="product-form"]', { timeout: 5000 }).should('be.visible')
    cy.get('[data-cy="product-title-input"]').should('be.visible').clear()
    cy.get('[data-cy="product-title-input"]').type('Updated Product')
    cy.get('[data-cy="product-price-input"]').should('be.visible').clear()
    cy.get('[data-cy="product-price-input"]').type('199.99')
    cy.get('[data-cy="product-form-submit-button"]').click()
    cy.wait('@updateProduct')
    cy.contains('Product updated successfully', { timeout: 5000 }).should('be.visible')
  })

  it('should delete product', () => {
    cy.visit('/admin/products')
    cy.wait('@getProducts')

    cy.intercept('DELETE', 'https://fakestoreapi.com/products/1', { statusCode: 200 }).as(
      'deleteProduct',
    )

    cy.get('[data-cy="product-row"]').first().find('[data-cy="product-delete-button"]').click()
    cy.get('[data-cy="confirm-dialog"]', { timeout: 5000 }).should('be.visible')
    cy.get('[data-cy="confirm-dialog-confirm-button"]').click()
    cy.wait('@deleteProduct')
    cy.contains('Product deleted successfully', { timeout: 5000 }).should('be.visible')
  })

  it('should display admin users page', () => {
    cy.visit('/admin/users')
    cy.wait('@getUsers')
    cy.get('[data-cy="add-user-button"]', { timeout: 5000 }).should('be.visible')
    cy.get('[data-cy="user-row"]').should('have.length', 2)
  })

  it('should create new user', () => {
    cy.visit('/admin/users')
    cy.wait('@getUsers')

    cy.intercept('POST', 'https://fakestoreapi.com/users', {
      statusCode: 201,
      body: { id: 3, username: 'newuser', email: 'newuser@test.com' },
    }).as('createUser')

    cy.get('[data-cy="add-user-button"]').click()
    cy.get('[data-cy="user-form"]', { timeout: 5000 }).should('be.visible')
    cy.get('[data-cy="user-username-input"]').type('newuser')
    cy.get('[data-cy="user-email-input"]').type('newuser@test.com')
    cy.get('[data-cy="user-password-input"]').type('password123')
    cy.get('[data-cy="user-form-submit-button"]').click()
    cy.wait('@createUser')
    cy.contains('User created successfully', { timeout: 5000 }).should('be.visible')
  })

  it('should redirect non-admin users', () => {
    cy.clearAuth()
    cy.login('mor_2314', '83r5^_')
    cy.visit('/admin/dashboard')
    cy.url({ timeout: 5000 }).should('not.include', '/admin')
  })
})
