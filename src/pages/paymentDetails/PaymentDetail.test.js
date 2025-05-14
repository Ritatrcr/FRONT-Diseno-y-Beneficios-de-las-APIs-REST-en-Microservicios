import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentDetail } from './PaymentDetail'; // Ajusta la ruta si es necesario
import { AuthContext } from '../context/AuthContext'; // Ajusta la ruta si es necesario
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom'; // Para manejar rutas dentro de las pruebas
import '@testing-library/jest-dom/extend-expect'; // Para las aserciones como "toBeInTheDocument"

// Mock de axios
jest.mock('axios');

// Componente de prueba para envolver PaymentDetail con contexto de autenticación
const Wrapper = ({ children }) => {
  return (
    <MemoryRouter initialEntries={['/payments/1']}>
      <AuthContext.Provider value={{ token: 'mock-token' }}>
        {children}
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('PaymentDetail', () => {
  it('should render loading state when payment data is being fetched', () => {
    render(
      <Wrapper>
        <PaymentDetail />
      </Wrapper>
    );

    expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
  });

  it('should display error message if fetching payment details fails', async () => {
    axios.get.mockRejectedValue(new Error('Error al obtener el detalle del pago'));

    render(
      <Wrapper>
        <PaymentDetail />
      </Wrapper>
    );

    // Esperar y verificar que el mensaje de error se muestra
    await waitFor(() => screen.getByText('Error al obtener el detalle del pago'));
    expect(screen.getByText('Error al obtener el detalle del pago')).toBeInTheDocument();
  });

  it('should render payment details correctly when fetched successfully', async () => {
    const mockPayment = {
      amount: 500,
      currency: 'COP',
      payment_method: 'Cuenta corriente',
      description: 'Pago de factura',
      status: 'Pendiente',
      created_at: '2023-05-01',
    };

    axios.get.mockResolvedValue({ data: mockPayment });

    render(
      <Wrapper>
        <PaymentDetail />
      </Wrapper>
    );

    // Verificar que los detalles del pago se muestran correctamente
    await waitFor(() => screen.getByText('Pago de factura'));
    expect(screen.getByText(`Monto: $${mockPayment.amount}`)).toBeInTheDocument();
    expect(screen.getByText(`Moneda: ${mockPayment.currency}`)).toBeInTheDocument();
    expect(screen.getByText(`Método de Pago: ${mockPayment.payment_method}`)).toBeInTheDocument();
    expect(screen.getByText(`Descripción: ${mockPayment.description}`)).toBeInTheDocument();
    expect(screen.getByText(`Estado: ${mockPayment.status}`)).toBeInTheDocument();
    expect(screen.getByText(`Fecha de Creación: ${mockPayment.created_at}`)).toBeInTheDocument();
  });

  it('should update payment status successfully', async () => {
    const mockPayment = {
      amount: 500,
      currency: 'COP',
      payment_method: 'Cuenta corriente',
      description: 'Pago de factura',
      status: 'Pendiente',
      created_at: '2023-05-01',
    };

    axios.get.mockResolvedValue({ data: mockPayment });
    axios.put.mockResolvedValue({ data: { message: 'Estado del pago actualizado correctamente' } });

    render(
      <Wrapper>
        <PaymentDetail />
      </Wrapper>
    );

    // Esperar y verificar que el detalle del pago se cargue
    await waitFor(() => screen.getByText('Pago de factura'));

    // Cambiar el estado del pago
    fireEvent.change(screen.getByLabelText(/Actualizar Estado/i), { target: { value: 'Aprobado' } });

    // Simular el clic en el botón de actualización
    fireEvent.click(screen.getByRole('button', { name: /Actualizar Estado/i }));

    // Verificar que el mensaje de éxito se muestre
    await waitFor(() => screen.getByText('Estado del pago actualizado correctamente'));
    expect(screen.getByText('Estado del pago actualizado correctamente')).toBeInTheDocument();
  });

  it('should delete payment successfully and redirect to /payments', async () => {
    const mockPayment = {
      amount: 500,
      currency: 'COP',
      payment_method: 'Cuenta corriente',
      description: 'Pago de factura',
      status: 'Pendiente',
      created_at: '2023-05-01',
    };

    axios.get.mockResolvedValue({ data: mockPayment });
    axios.delete.mockResolvedValue({ data: { message: 'Pago eliminado correctamente' } });

    const mockNavigate = jest.fn();

    render(
      <Wrapper>
        <PaymentDetail />
      </Wrapper>
    );

    // Esperar y verificar que el detalle del pago se cargue
    await waitFor(() => screen.getByText('Pago de factura'));

    // Simular clic en el botón de eliminar pago
    fireEvent.click(screen.getByRole('button', { name: /Eliminar Pago/i }));

    // Verificar que el mensaje de éxito se muestre
    await waitFor(() => screen.getByText('Pago eliminado correctamente'));
    expect(screen.getByText('Pago eliminado correctamente')).toBeInTheDocument();

    // Verificar que la redirección ocurra después de eliminar
    expect(mockNavigate).toHaveBeenCalledWith('/payments');
  });
});
