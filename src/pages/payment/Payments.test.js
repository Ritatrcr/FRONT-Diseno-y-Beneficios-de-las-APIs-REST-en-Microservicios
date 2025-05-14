import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Payments } from './Payments'; // Ajusta la ruta si es necesario
import { AuthContext } from '../context/AuthContext'; // Ajusta la ruta si es necesario
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom'; // Para manejar las rutas dentro de las pruebas
import '@testing-library/jest-dom/extend-expect'; // Para las aserciones como "toBeInTheDocument"

// Mock de axios
jest.mock('axios');

// Componente de prueba para envolver Payments con contexto de autenticación
const Wrapper = ({ children }) => {
  return (
    <MemoryRouter>
      <AuthContext.Provider value={{ token: 'mock-token' }}>
        {children}
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Payments', () => {
  it('should render the form with amount, currency, payment_method, and description fields', () => {
    render(
      <Wrapper>
        <Payments />
      </Wrapper>
    );

    // Verificar que los campos del formulario estén presentes
    expect(screen.getByLabelText(/Monto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Moneda/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Método de pago/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear Pago/i })).toBeInTheDocument();
  });

  it('should display error message if fetchPayments fails', async () => {
    axios.get.mockRejectedValue(new Error('Error al obtener pagos'));

    render(
      <Wrapper>
        <Payments />
      </Wrapper>
    );

    // Esperar y verificar el mensaje de error
    await waitFor(() => screen.getByText('Error al obtener pagos'));
    expect(screen.getByText('Error al obtener pagos')).toBeInTheDocument();
  });

  it('should display success message when a payment is successfully submitted', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Pago creado exitosamente' } });
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Wrapper>
        <Payments />
      </Wrapper>
    );

    // Completar el formulario
    fireEvent.change(screen.getByLabelText(/Monto/i), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Moneda/i), { target: { value: 'COP' } });
    fireEvent.change(screen.getByLabelText(/Método de pago/i), { target: { value: 'Cuenta corriente' } });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Pago de factura' } });

    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /Crear Pago/i }));

    // Esperar y verificar el mensaje de éxito
    await waitFor(() => screen.getByText('Pago creado exitosamente'));
    expect(screen.getByText('Pago creado exitosamente')).toBeInTheDocument();
  });

  it('should render the list of payments if they are fetched successfully', async () => {
    const mockPayments = [
      { payment_id: 1, amount: 500, status: 'Pendiente', description: 'Pago de factura' },
      { payment_id: 2, amount: 200, status: 'Aprobado', description: 'Pago de servicio' }
    ];

    axios.get.mockResolvedValue({ data: mockPayments });

    render(
      <Wrapper>
        <Payments />
      </Wrapper>
    );

    // Esperar y verificar que la lista de pagos se muestra
    await waitFor(() => screen.getByText('Pago de factura'));
    expect(screen.getByText('Pago de factura')).toBeInTheDocument();
    expect(screen.getByText('Pago de servicio')).toBeInTheDocument();
  });

  it('should handle the fetchPayments function when reloading', async () => {
    const mockPayments = [
      { payment_id: 1, amount: 500, status: 'Pendiente', description: 'Pago de factura' },
    ];

    axios.get.mockResolvedValue({ data: mockPayments });

    render(
      <Wrapper>
        <Payments />
      </Wrapper>
    );

    // Verificar que el componente hizo la llamada a fetchPayments correctamente
    await waitFor(() => screen.getByText('Pago de factura'));
    expect(screen.getByText('Pago de factura')).toBeInTheDocument();
  });
});
