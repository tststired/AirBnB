import React, { useState } from 'react';
import Register from '../../src/Auth/Register';
import SignIn from '../../src/Auth/Login';

import { MemoryRouter, Routes, Route } from 'react-router-dom';

describe('<dashboard search />', () => {
  let token;
  let setToken;
  let email;
  let setEmail;

  beforeEach(() => {
    token = 'a';
    setToken = cy.stub().as('setToken');
    email = 'a'
    setEmail = cy.stub().as('setEmail');
  });

  const renderDash = (tokenValue = null) => {
    return (
      <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
            <Route path="/login" element={<SignIn token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
          </Routes>
      </MemoryRouter>
    );
  };
  it('should display register and login', () => {
    cy.mount(renderDash());

    // email
    cy.get('#email').scrollIntoView().should('be.visible')
    // password
    cy.get('#password').scrollIntoView().should('be.visible')
    // confirm password
    cy.get('#password-confirm').scrollIntoView().should('be.visible')
    // button to sign in
    cy.get('.MuiButtonBase-root').scrollIntoView().should('be.visible')
    // swap to login from register
    cy.get('a').click();
    cy.get('#email').scrollIntoView().should('be.visible')
    cy.get('#password').scrollIntoView().should('be.visible')
  });
});
