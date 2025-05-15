describe('Página de Login', () => {
    beforeEach(() => {
      cy.visit(
        'http://localhost:3000/login'
      );
    });
  
    it('debería renderizar correctamente los campos y el botón', () => {
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Inicia Sesión');
    });
  
    it('debería mostrar un mensaje de error si las credenciales son incorrectas', () => {
      cy.intercept('POST', 'http://localhost:3000/login', {
        statusCode: 401,
        body: { message: 'Credenciales inválidas' },
      }).as('loginRequest');
  
      cy.get('input[type="email"]').type('fakeuser@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest');
      cy.contains('Credenciales inválidas').should('be.visible');
    });
  
    it('debería iniciar sesión correctamente con credenciales válidas', () => {
      cy.intercept('POST', 'http://localhost:3000/login', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token',
          user: { email: 'usuario@valido.com' },
        },
      }).as('loginRequest');
  
      cy.get('input[type="email"]').type('usuario@valido.com');
      cy.get('input[type="password"]').type('correctpassword');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest');
      cy.contains('Sesión iniciada exitosamente').should('be.visible');
    });
  });
  