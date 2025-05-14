import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App'; // Ajusta la ruta si es necesario
import { AuthContext } from './context/AuthContext'; // Ajusta la ruta si es necesario
import '@testing-library/jest-dom/extend-expect'; // Para las aserciones como "toBeInTheDocument"

// Mock del componente PrivateRoute
jest.mock('./components/PrivateRoute', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

describe('App', () => {
  it('should render the login page on /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Inicia sesión/i)).toBeInTheDocument();
  });

  it('should render the register page on /register route', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Crear una cuenta/i)).toBeInTheDocument();
  });

  it('should render the Home page if the user is authenticated', () => {
    const value = { token: 'mock-token' };

    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthContext.Provider value={value}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
  });

  it('should render the Payments page if the user is authenticated', () => {
    const value = { token: 'mock-token' };

    render(
      <MemoryRouter initialEntries={['/payments']}>
        <AuthContext.Provider value={value}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Pagos/i)).toBeInTheDocument();
  });

  it('should render the PaymentDetail page if the user is authenticated', () => {
    const value = { token: 'mock-token' };

    render(
      <MemoryRouter initialEntries={['/payments/1']}>
        <AuthContext.Provider value={value}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Detalle del Pago/i)).toBeInTheDocument();
  });

  it('should render the Refunds page if the user is authenticated', () => {
    const value = { token: 'mock-token' };

    render(
      <MemoryRouter initialEntries={['/refunds']}>
        <AuthContext.Provider value={value}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Reembolsos/i)).toBeInTheDocument();
  });

  it('should render the RefundDetail page if the user is authenticated', () => {
    const value = { token: 'mock-token' };

    render(
      <MemoryRouter initialEntries={['/refunds/1']}>
        <AuthContext.Provider value={value}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Detalle del Reembolso/i)).toBeInTheDocument();
  });
});
