describe('Cart', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'POST',
        hostname: 'fakestoreapi.com',
        pathname: '/auth/login',
      },
      { fixture: 'auth.json' },
    ).as('login')
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
        pathname: '/carts/user/1',
      },
      { fixture: 'carts.json' },
    ).as('getCart')
    cy.intercept(
      {
        method: 'GET',
        hostname: 'fakestoreapi.com',
        pathname: '/products/1',
      },
      { fixture: 'product.json' },
    ).as('getProduct1')
    cy.intercept(
      {
        method: 'GET',
        hostname: 'fakestoreapi.com',
        pathname: '/products/2',
      },
      { fixture: 'product.json' },
    ).as('getProduct2')

    cy.login('johnd', 'm38rmF$')
  })

  it('should add product to cart', () => {
    cy.visit('/products')
    cy.wait('@getProducts')

    cy.intercept(
      {
        method: 'PUT',
        hostname: 'fakestoreapi.com',
        pathname: '/carts/1',
      },
      { fixture: 'cart.json' },
    ).as('updateCart')

    cy.get('[data-cy="product-card"]', { timeout: 10000 }).first().should('be.visible')
    cy.get('[data-cy="product-card"]').first().find('[data-cy="add-to-cart-button"]').click()
    cy.wait('@updateCart', { timeout: 10000 })
    cy.contains('added to cart', { timeout: 5000 }).should('be.visible')
  })

  it('should display cart items', () => {
    cy.visit('/cart')

    cy.wait('@getCart', { timeout: 10000 })
    cy.wait('@getProduct1', { timeout: 10000 })
    cy.wait('@getProduct2', { timeout: 10000 })

    cy.get('[data-cy="cart-view"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-cy="cart-title"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-cy="cart-title"]').should('contain.text', 'Shopping Cart')
    cy.get('[data-cy="cart-item"]', { timeout: 10000 }).should('have.length.at.least', 1)
  })

  it('should update cart item quantity', () => {
    cy.visit('/cart')

    cy.wait('@getCart', { timeout: 10000 })
    cy.wait(['@getProduct1', '@getProduct2'], { timeout: 10000 })
    cy.get('[data-cy="cart-item"]', { timeout: 10000 }).should('have.length.at.least', 1)

    cy.intercept(
      {
        method: 'PUT',
        hostname: 'fakestoreapi.com',
        pathname: '/carts/1',
      },
      { fixture: 'cart.json' },
    ).as('updateCart')

    cy.get('[data-cy="increase-quantity-button"]').first().click()
    cy.wait('@updateCart', { timeout: 10000 })
    cy.get('[data-cy="item-quantity"]').first().should('be.visible')
  })

  it('should remove item from cart', () => {
    cy.visit('/cart')

    cy.wait('@getCart', { timeout: 10000 })
    cy.wait(['@getProduct1', '@getProduct2'], { timeout: 10000 })
    cy.get('[data-cy="cart-item"]', { timeout: 10000 }).should('have.length.at.least', 1)

    cy.intercept(
      {
        method: 'PUT',
        hostname: 'fakestoreapi.com',
        pathname: '/carts/1',
      },
      { fixture: 'cart.json' },
    ).as('updateCart')

    cy.get('[data-cy="remove-item-button"]').first().click()
    cy.wait('@updateCart', { timeout: 10000 })
    cy.get('[data-cy="cart-item"]').should('have.length', 0)
  })

  it('should redirect to login if not authenticated', () => {
    cy.window().then((win) => {
      win.localStorage.clear()
    })

    cy.visit('/cart')
    cy.url().should('include', '/login')
  })
})
