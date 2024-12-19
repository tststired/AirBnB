import React, { useState } from 'react';
import Register from '../../src/Auth/Register';
import SignIn from '../../src/Auth/Login';
import Dashboard from '../../src/Dashboards/Dashboard';
import Header from '../../src/Dashboards/Header';
import UserListings from '../../src/Dashboards/UserListing';
import UserListingsEdit from '../../src/Dashboards/UserListingManage';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import 'cypress-file-upload'

describe('<UserListingUpload test/>', () => {
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
      <MemoryRouter initialEntries={['/login']}>
        <Header token={token} setToken={setToken} setEmail={setEmail} email={email}/>
          <Routes>
            <Route path='/register' element={<Register token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
            <Route path='/login' element={<SignIn token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
            <Route path='/' element={<Dashboard />} />
            <Route path='/userListingsEdit/:id' element={<UserListingsEdit token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
            <Route path='/userListings' element={<UserListings token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
          </Routes>
      </MemoryRouter>
    );
  };

  it('assumes user is logged in from previous tests of authregisterlogin', () => {
    cy.mount(renderDash());
    cy.get('.MuiToolbar-root > :nth-child(3)').click();
    cy.get('.MuiStack-root > .MuiButtonBase-root').click();
    cy.get('#title').type('titletest');
    cy.get('#address').type('address');
    cy.get('#price').type('100');
    cy.get('#type').type('propertytypetest');
    cy.get('#bathrooms').type('1');
    cy.get('#beds').type('1');
    cy.get('#bedrooms').type('1');
    cy.get('#amenities').type('amenitiestest');
    cy.fixture('Blank.png').then((fileContent) => {
      cy.get('[data-cy=thumbnail-upload]').attachFile(
        {
          fileContent: fileContent.toString(),
          fileName: 'Blank.png',
          mimeType: 'image/png',
          encoding: 'base64',
        }
      );
    });
  });
});
