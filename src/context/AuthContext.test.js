import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, AuthContext } from './AuthContext'; 

// Componente de prueba para consumir el contexto
const TestComponent = () => {
  const { token, user, login, logout } = React.useContext(AuthContext);

  return (
    <div>
      <div data-testid="token">{token}</div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <button onClick={() => login('newToken', { name: 'John Doe' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('should provide default null values', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Verificar los valores por defecto
    expect(screen.getByTestId('token').textContent).toBe('');
    expect(screen.getByTestId('user').textContent).toBe('No user');
  });

  it('should login and set token and user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simular un login
    fireEvent.click(screen.getByText('Login'));

    // Verificar que el token y el usuario fueron establecidos correctamente
    expect(screen.getByTestId('token').textContent).toBe('newToken');
    expect(screen.getByTestId('user').textContent).toBe('John Doe');
  });

  it('should logout and clear token and user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simular un login primero
    fireEvent.click(screen.getByText('Login'));

    // Simular un logout
    fireEvent.click(screen.getByText('Logout'));

    // Verificar que el token y el usuario fueron eliminados
    expect(screen.getByTestId('token').textContent).toBe('');
    expect(screen.getByTestId('user').textContent).toBe('No user');
  });
});
