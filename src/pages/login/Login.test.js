import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login'; // Asegúrate de que la ruta del componente sea correcta
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

// Simulamos el login context
const mockLogin = jest.fn();

jest.mock('axios');

describe('Login Component', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  test('should display error message on failed login', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Error al iniciar sesión' } },
    });

    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );

    const emailInput = screen.getByLabelText('Correo Electronico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByText('Inicia Sesión');

    fireEvent.change(emailInput, { target: { value: 'wrong@domain.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => screen.getByText('Error al iniciar sesión'));
    expect(screen.getByText('Error al iniciar sesión')).toBeInTheDocument();
  });

  test('should display success message and redirect on successful login', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'fake-token',
        user: { email: 'test@domain.com' },
      },
    });

    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );

    const emailInput = screen.getByLabelText('Correo Electronico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByText('Inicia Sesión');

    fireEvent.change(emailInput, { target: { value: 'test@domain.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => screen.getByText('Sesión iniciada exitosamente'));

    expect(mockLogin).toHaveBeenCalledWith('fake-token', { email: 'test@domain.com' });
    expect(screen.getByText('Sesión iniciada exitosamente')).toBeInTheDocument();

    // Simula la redirección (sin navegar realmente)
    expect(window.location.href).toBe('/');
  });
});
