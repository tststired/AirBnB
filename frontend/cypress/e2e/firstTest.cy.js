describe('Tests functionality of website', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/')
    })
    it('Visits the website and registers', () => {
      cy.contains('button', 'Home').click();
      cy.contains('button', 'Login').click();
      cy.contains('button', 'Sign In').click();
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Invalid credentials');
      });
      cy.contains('a', 'Don\'t have an account? Sign Up').click();
      cy.get('input').as('allFieldsets');
      cy.get('@allFieldsets').eq(0).type('test@gmail.com');
      cy.get('@allFieldsets').eq(1).type('test');
      cy.get('@allFieldsets').eq(2).type('test');
      cy.get('@allFieldsets').eq(3).type('John');
      cy.contains('button', 'Sign In').click();
    });
  
    it('Visits the website and registers another person', () => {
      cy.contains('button', 'Home').click();
      cy.get('body').then($body => {
        if ($body.find('button', 'Logout').length) {
          cy.contains('button', 'Logout').click();
        }
      });
      cy.contains('button', 'Login').click();
      cy.contains('button', 'Sign In').click();
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Invalid credentials');
      });
      cy.contains('a', 'Don\'t have an account? Sign Up').click();
      cy.get('input').as('allFieldsets');
      cy.get('@allFieldsets').eq(0).type('test1@gmail.com');
      cy.get('@allFieldsets').eq(1).type('test');
      cy.get('@allFieldsets').eq(2).type('test');
      cy.get('@allFieldsets').eq(3).type('Jack');
      cy.contains('button', 'Sign In').click();
    });
  })