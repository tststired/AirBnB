import React, { useState } from 'react';
import Dashboard from '../../src/Dashboards/Dashboard';
import ButtonAppBar from '../../src/Dashboards/Header';
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
      <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path="/register" element={<Register token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
            <Route path="/login" element={<SignIn token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
          </Routes>
      </MemoryRouter>
    );
  };
  it('should display the menu button', () => {
    cy.mount(renderDash());
    // click button to open search
    cy.get('.MuiTypography-h5 > .MuiButtonBase-root').should('be.visible')
    // click on button open search
    cy.get('.MuiTypography-h5 > .MuiButtonBase-root').click();
    // reset form
    cy.get('.MuiDialogActions-root > :nth-child(1)').scrollIntoView().should('be.visible')
    // clear form
    cy.get('.MuiDialogActions-root > :nth-child(2)').scrollIntoView().should('be.visible')
    // submit form
    cy.get('[type="submit"]').scrollIntoView().scrollIntoView().should('be.visible')
    // cancel form
    cy.get('.MuiDialogActions-root > :nth-child(4)').scrollIntoView().should('be.visible')

    // Search input params
    cy.get('#BedroomsMin').scrollIntoView().should('be.visible')
    cy.get('#BedroomsMax').scrollIntoView().should('be.visible')
    cy.get('#PriceMin').scrollIntoView().should('be.visible')
    cy.get('#PriceMax').scrollIntoView().should('be.visible')
    cy.get('#Search').scrollIntoView().should('be.visible')

    // from date
    cy.get(':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root').scrollIntoView().should('be.visible')
    // to date
    cy.get('.MuiDialogContent-root > :nth-child(2) > .MuiFormControl-root > .MuiInputBase-root').scrollIntoView().should('be.visible')
    // clickign calender
    cy.get(':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root').click();
    // calender poopup from to date
    cy.get('.MuiDateCalendar-root').should('be.visible')
  });
});
