import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import SignIn from '../Auth/Login';
import React, { useState } from 'react';
import userEvent from '@testing-library/user-event';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}))
const setState = jest.fn()

describe('Login', () => {
  beforeEach(() => {
    useState.mockImplementation((init) => [init, setState])
  })
  it('renders Login component', () => {
    render(
        <Router>
          <SignIn setToken={setState} setEmail={setState}/>;
        </Router>
    )
    expect(screen.getByRole('textbox', {
      name: /email address/i
    }))
    expect(screen.getByRole('link', {
      name: /don't have an account\? sign up/i
    }))
    expect(screen.getByRole('button', {
      name: /sign in/i
    }))
  });
});
