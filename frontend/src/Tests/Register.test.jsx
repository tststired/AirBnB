import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import Register from '../Auth/Register';
import React, { useState } from 'react';
import userEvent from '@testing-library/user-event';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}))
const setState = jest.fn()

describe('Register', () => {
  beforeEach(() => {
    useState.mockImplementation((init) => [init, setState])
  })

  it('renders Register component', () => {
    render(
        <Router>
          <Register setToken={setState} setEmail={setState}/>;
        </Router>
    )
    expect(screen.getByRole('textbox', { name: /email address/i }));
    expect(screen.getByRole('textbox', { name: /name/i }));
    expect(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('link', { name: /alreyyady have an account\? sign in/i }));
  });
});
