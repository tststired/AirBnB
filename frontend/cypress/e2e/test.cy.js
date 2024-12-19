import 'cypress-file-upload'

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

  it('Logs in and makes a listing', () => {
    cy.contains('button', 'Home').click();
    cy.contains('button', 'Logout').click();
    cy.contains('button', 'Login').click();
    cy.get('input').as('allFieldsets');
    cy.get('@allFieldsets').eq(0).type('test@gmail.com');
    cy.get('@allFieldsets').eq(1).type('test');
    cy.contains('button', 'Sign In').click();
    cy.contains('button', 'Listings').click();
    cy.contains('button', 'Make Belle happy with your new listing').click();
    cy.get('input').as('inputs');
    cy.get('@inputs').eq(0).type('Good Place');
    cy.get('@inputs').eq(1).type('Sydney Somewhere');
    cy.get('@inputs').eq(2).type('400');
    cy.get('@inputs').eq(3).type('Apartment');
    cy.get('@inputs').eq(4).type('3');
    cy.get('@inputs').eq(5).type('4');
    cy.get('@inputs').eq(6).type('6');
    cy.get('@inputs').eq(7).type('Pool, Spa, Gym');
    cy.fixture('Blank.png').then((fileContent) => {
      cy.get('[data-cy=thumbnail-upload]').attachFile(
        {
          fileContent: fileContent.toString(),
          fileName: 'Blank.png',
          mimeType: 'image/png',
          encoding: 'base64',
        }
      );
      cy.get('@inputs').eq(8).attachFile(
        {
          fileContent: fileContent.toString(),
          fileName: 'Blank.png',
          mimeType: 'image/png',
          encoding: 'base64',
        }
      );
    });
    cy.contains('button', 'Create Listing').click();
  });

  it('Logs in and publishes a listing', () => {
    cy.contains('button', 'Listings').click();
    cy.contains('button', 'Manage').as('manage');
    cy.get('@manage').eq(0).click();
    cy.contains('button', 'Publish listing, make me money!').click();
    cy.get('input').as('inputs');
    cy.get('@inputs').eq(0).type('11092023');
    cy.get('@inputs').eq(1).type('11302023');
    cy.get('button[type="submit"][tabindex="0"]').contains('Publish').click();
  });

  it('Logs in and makes a booking', () => {
    cy.contains('button', 'Home').click();
    cy.get('body').then($body => {
      if ($body.find('button', 'Logout').length) {
        cy.contains('button', 'Logout').click();
      }
    });
    cy.contains('button', 'Login').click();
    cy.get('input').as('allFieldsets');
    cy.get('@allFieldsets').eq(0).type('test1@gmail.com');
    cy.get('@allFieldsets').eq(1).type('test');
    cy.contains('button', 'Sign In').click();
    cy.contains('button', 'View').as('listingsView');
    cy.get('@listingsView').eq(0).click();
    cy.contains('button', 'Make Booking').click();
    cy.get('input').as('inputs');
    cy.get('@inputs').eq(0).type('11152023');
    cy.get('@inputs').eq(1).type('11162023');
    cy.get('button[type="submit"][tabindex="0"]').contains('Send Booking').click();
  });

  it('Logs in and accepts a booking', () => {
    cy.contains('button', 'Home').click();
    cy.get('body').then($body => {
      if ($body.find('button', 'Logout').length) {
        cy.contains('button', 'Logout').click();
      }
    });
    cy.contains('button', 'Login').click();
    cy.get('input').as('allFieldsets');
    cy.get('@allFieldsets').eq(0).type('test@gmail.com');
    cy.get('@allFieldsets').eq(1).type('test');
    cy.contains('button', 'Sign In').click();
    cy.contains('button', 'Listing').click();
    cy.contains('button', 'Bookings').as('listingsView');
    cy.get('@listingsView').eq(0).click();
    cy.contains('button', 'Accept').as('accept');
    cy.get('@accept').eq(0).click();
  });

  it('Logs in and makes a review', () => {
    cy.contains('button', 'Home').click();
    cy.get('body').then($body => {
      if ($body.find('button', 'Logout').length) {
        cy.contains('button', 'Logout').click();
      }
    });
    cy.contains('button', 'Login').click();
    cy.get('input').as('allFieldsets');
    cy.get('@allFieldsets').eq(0).type('test1@gmail.com');
    cy.get('@allFieldsets').eq(1).type('test');
    cy.contains('button', 'Sign In').click();
    cy.contains('button', 'View').as('listingsView');
    cy.get('@listingsView').eq(0).click();
    cy.contains('button', 'Make Review').click();
    cy.get('input').as('inputs');
    cy.get('@inputs').eq(0).type('4');
    cy.get('@inputs').eq(1).type('Not Bad pretty good');
    cy.get('button[type="submit"][tabindex="0"]').contains('Make Review').click();
  });

  it('Logs in and unpublishes a listing', () => {
    cy.contains('button', 'Home').click();
    cy.get('body').then($body => {
      if ($body.find('button', 'Logout').length) {
        cy.contains('button', 'Logout').click();
      }
    });
    cy.contains('button', 'Login').click();
    cy.get('input').as('allFieldsets');
    cy.get('@allFieldsets').eq(0).type('test@gmail.com');
    cy.get('@allFieldsets').eq(1).type('test');
    cy.contains('button', 'Sign In').click();
    cy.contains('button', 'Listings').click();
    cy.contains('button', 'Manage').as('manage');
    cy.get('@manage').eq(0).click();
    cy.contains('button', 'UnPublish listing, make me poor').click();
  });
})