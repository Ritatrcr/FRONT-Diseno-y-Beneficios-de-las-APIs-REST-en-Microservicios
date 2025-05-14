import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Register } from './Register'; // Ajusta la ruta si es necesario
import { AuthContext } from '../context/AuthContext'; // Ajusta la ruta si es necesario
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom'; // Para manejar las rutas dentro de las pruebas
import '@testing-library/jest-dom/extend-expect'; // Para las aserciones como "toBeInTheDocument"

// Mock de axios
jest.mock('axios');

// Componente de prueba para envolver Register con contexto de autenticación
const Wrapper = ({ children }) => {
  return (
    <MemoryRouter>
      <AuthContext.Provider value={{ login: jest.fn() }}>
        {children}
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Register', () => {
  it('should render the form with email, password, and username fields', () => {
    render(
      <Wrapper>
        <Register />
      </Wrapper>
    );

    // Verificar que los campos del formulario estén presentes
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CREAR CUENTA/i })).toBeInTheDocument();
  });

  it('should display error message if registration fails', async () => {
    axios.post.mockRejectedValue(new Error('Error al registrar el usuario'));

    render(
      <Wrapper>
        <Register />
      </Wrapper>
    );

    // Completar el formulario
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'testuser' } });

    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /CREAR CUENTA/i }));

    // Esperar y verificar el mensaje de error
    await waitFor(() => screen.getByText('Error al registrar el usuario'));
    expect(screen.getByText('Error al registrar el usuario')).toBeInTheDocument();
  });

  it('should display success message after successful registration', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Usuario registrado exitosamente' } });

    render(
      <Wrapper>
        <Register />
      </Wrapper>
    );

    // Completar el formulario
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'testuser' } });

    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /CREAR CUENTA/i }));

    // Esperar y verificar el mensaje de éxito
    await waitFor(() => screen.getByText('Usuario registrado exitosamente'));
    expect(screen.getByText('Usuario registrado exitosamente')).toBeInTheDocument();
  });

  it('should redirect to /login after successful registration', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Usuario registrado exitosamente' } });
    const mockNavigate = jest.fn();

    render(
      <Wrapper>
        <Register />
      </Wrapper>
    );

    // Completar el formulario
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'testuser' } });

    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /CREAR CUENTA/i }));

    // Esperar y verificar la redirección
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });
});
