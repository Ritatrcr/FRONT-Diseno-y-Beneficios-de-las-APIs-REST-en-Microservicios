import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { RefundDetail } from './RefundDetail'; // Ajusta la ruta si es necesario
import { AuthContext } from '../context/AuthContext'; // Ajusta la ruta si es necesario
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom'; // Para manejar rutas dentro de las pruebas
import '@testing-library/jest-dom/extend-expect'; // Para las aserciones como "toBeInTheDocument"

// Mock de axios
jest.mock('axios');

// Componente de prueba para envolver RefundDetail con contexto de autenticación
const Wrapper = ({ children }) => {
  return (
    <MemoryRouter initialEntries={['/refunds/1']}>
      <AuthContext.Provider value={{ token: 'mock-token' }}>
        {children}
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('RefundDetail', () => {
  it('should render loading state when refund data is being fetched', () => {
    render(
      <Wrapper>
        <RefundDetail />
      </Wrapper>
    );

    expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
  });

  it('should display error message if fetching refund details fails', async () => {
    axios.get.mockRejectedValue(new Error('Error al obtener el detalle del reembolso'));

    render(
      <Wrapper>
        <RefundDetail />
      </Wrapper>
    );

    // Esperar y verificar el mensaje de error
    await waitFor(() => screen.getByText('Error al obtener el detalle del reembolso'));
    expect(screen.getByText('Error al obtener el detalle del reembolso')).toBeInTheDocument();
  });

  it('should render refund details correctly when fetched successfully', async () => {
    const mockRefund = {
      payment_id: '12345',
      amount: 500,
      reason: 'Producto defectuoso',
      status: 'Aprobado',
      requested_at: '2023-05-01',
    };

    axios.get.mockResolvedValue({ data: mockRefund });

    render(
      <Wrapper>
        <RefundDetail />
      </Wrapper>
    );

    // Verificar que los detalles del reembolso se muestran correctamente
    await waitFor(() => screen.getByText('Producto defectuoso'));
    expect(screen.getByText(`ID de Pago: ${mockRefund.payment_id}`)).toBeInTheDocument();
    expect(screen.getByText(`Monto: $${mockRefund.amount}`)).toBeInTheDocument();
    expect(screen.getByText(`Razón: ${mockRefund.reason}`)).toBeInTheDocument();
    expect(screen.getByText(`Estado: ${mockRefund.status}`)).toBeInTheDocument();
    expect(screen.getByText(`Fecha de Solicitud: ${mockRefund.requested_at}`)).toBeInTheDocument();
  });

  it('should display "Solicitar otro reembolso" button', async () => {
    const mockRefund = {
      payment_id: '12345',
      amount: 500,
      reason: 'Producto defectuoso',
      status: 'Aprobado',
      requested_at: '2023-05-01',
    };

    axios.get.mockResolvedValue({ data: mockRefund });

    render(
      <Wrapper>
        <RefundDetail />
      </Wrapper>
    );

    // Verificar que el botón "Solicitar otro reembolso" está presente
    await waitFor(() => screen.getByText('Solicitar otro reembolso'));
    expect(screen.getByText('Solicitar otro reembolso')).toBeInTheDocument();
  });
});
