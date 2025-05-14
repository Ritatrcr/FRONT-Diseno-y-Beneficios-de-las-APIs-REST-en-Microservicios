import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Para manejar rutas en pruebas
import { AuthProvider } from '../context/AuthContext'; // Ajusta la ruta si es necesario
import DashboardLayout from './DashboardLayout'; // Ajusta la ruta si es necesario

// Componente de prueba para envolver DashboardLayout con contexto de autenticación
const Wrapper = ({ children }) => {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );
};

describe('DashboardLayout', () => {
  it('should render the welcome message with the user name or email', () => {
    const user = { username: 'John Doe' };

    render(
      <Wrapper>
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      </Wrapper>
    );

    expect(screen.getByText(/Bienvenido, John Doe/i)).toBeInTheDocument();
  });

  it('should show the default welcome message if no user is logged in', () => {
    render(
      <Wrapper>
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      </Wrapper>
    );

    expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
  });

  it('should render the menu items', () => {
    render(
      <Wrapper>
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      </Wrapper>
    );

    // Verificar que los elementos del menú se rendericen
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Pagos/i)).toBeInTheDocument();
    expect(screen.getByText(/Reembolsos/i)).toBeInTheDocument();
    expect(screen.getByText(/Finanzas/i)).toBeInTheDocument();
    expect(screen.getByText(/Ayuda/i)).toBeInTheDocument();
  });

  it('should call logout and redirect to login on logout button click', () => {
    const mockLogout = jest.fn();
    const mockNavigate = jest.fn();

    // Renderizar el componente con un usuario simulado
    render(
      <Wrapper>
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      </Wrapper>
    );

    // Verificar si el botón de logout está presente
    const logoutButton = screen.getByRole('button', { name: /Salida segura/i });

    // Simular clic en el botón de logout
    fireEvent.click(logoutButton);

    // Verificar si el método logout se llamó
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should render the drawer and the menu items properly', () => {
    render(
      <Wrapper>
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      </Wrapper>
    );

    // Verificar que el drawer (menú lateral) se renderice
    const homeMenuItem = screen.getByText(/Home/i);
    expect(homeMenuItem).toBeInTheDocument();
  });
});
