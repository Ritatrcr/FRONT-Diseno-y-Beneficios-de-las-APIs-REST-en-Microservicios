import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Refunds } from './Refunds'; // Ajusta la ruta si es necesario
import { AuthContext } from '../context/AuthContext'; // Ajusta la ruta si es necesario
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom'; // Para manejar rutas en pruebas
import '@testing-library/jest-dom/extend-expect'; // Para las aserciones como "toBeInTheDocument"

// Mock de axios
jest.mock('axios');

// Componente de prueba para envolver Refunds con contexto de autenticación
const Wrapper = ({ children, token }) => {
  return (
    <MemoryRouter>
      <AuthContext.Provider value={{ token }}>
        {children}
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Refunds', () => {
  it('should render the form with payment_id, amount, and reason fields', () => {
    const token = 'mock-token';
    render(
      <Wrapper token={token}>
        <Refunds />
      </Wrapper>
    );

    // Verificar que los campos del formulario estén presentes
    expect(screen.getByLabelText(/ID de Pago/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Razón/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Solicitar Reembolso/i })).toBeInTheDocument();
  });

  it('should display error message if there is an error fetching refunds', async () => {
    const token = 'mock-token';
    axios.get.mockRejectedValue(new Error('Error al obtener reembolsos'));

    render(
      <Wrapper token={token}>
        <Refunds />
      </Wrapper>
    );

    // Esperar y verificar el mensaje de error
    await waitFor(() => screen.getByText('Error al obtener reembolsos'));
    expect(screen.getByText('Error al obtener reembolsos')).toBeInTheDocument();
  });

  it('should display success message when a refund is successfully submitted', async () => {
    const token = 'mock-token';
    axios.post.mockResolvedValue({ data: { message: 'Reembolso solicitado exitosamente' } });
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Wrapper token={token}>
        <Refunds />
      </Wrapper>
    );

    // Simular completar el formulario y enviarlo
    fireEvent.change(screen.getByLabelText(/ID de Pago/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/Monto/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Razón/i), { target: { value: 'Error en el pago' } });

    fireEvent.click(screen.getByRole('button', { name: /Solicitar Reembolso/i }));

    // Esperar y verificar que el mensaje de éxito esté presente
    await waitFor(() => screen.getByText('Reembolso solicitado exitosamente'));
    expect(screen.getByText('Reembolso solicitado exitosamente')).toBeInTheDocument();
  });

  it('should render the list of refunds if they are fetched successfully', async () => {
    const token = 'mock-token';
    const mockRefunds = [
      { refund_id: 1, payment_id: '12345', status: 'pendiente', reason: 'Error en pago' },
      { refund_id: 2, payment_id: '67890', status: 'aprobado', reason: 'Producto defectuoso' }
    ];

    axios.get.mockResolvedValue({ data: mockRefunds });

    render(
      <Wrapper token={token}>
        <Refunds />
      </Wrapper>
    );

    // Esperar y verificar que la lista de reembolsos se muestra
    await waitFor(() => screen.getByText('Pago: 12345 - pendiente'));
    expect(screen.getByText('Pago: 12345 - pendiente')).toBeInTheDocument();
    expect(screen.getByText('Pago: 67890 - aprobado')).toBeInTheDocument();
  });

  it('should handle the fetchRefunds function when reloading', async () => {
    const token = 'mock-token';
    const mockRefunds = [
      { refund_id: 1, payment_id: '12345', status: 'pendiente', reason: 'Error en pago' },
    ];

    axios.get.mockResolvedValue({ data: mockRefunds });

    render(
      <Wrapper token={token}>
        <Refunds />
      </Wrapper>
    );

    // Verificar que el componente hizo la llamada a fetchRefunds correctamente
    await waitFor(() => screen.getByText('Pago: 12345 - pendiente'));
    expect(screen.getByText('Pago: 12345 - pendiente')).toBeInTheDocument();
  });
});
