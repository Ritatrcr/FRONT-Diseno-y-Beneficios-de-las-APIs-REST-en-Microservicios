import { render, screen } from '@testing-library/react';
import { AuthContext } from '../../context/AuthContext';
import Home from './Home';

// Mocking the AuthContext to provide a mock user
const mockUser = { username: 'Juan', email: 'juan@example.com' };

describe('Home component', () => {
  test('should render greeting with username', () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Home />
      </AuthContext.Provider>
    );

    const greetingText = screen.getByText(/¡Hola, Juan!/i);
    expect(greetingText).toBeInTheDocument();
  });

  test('should render buttons for actions like "Recargar celular" and "Inscribir servicios"', () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Home />
      </AuthContext.Provider>
    );

    const rechargeButton = screen.getByText(/Recargar celular/i);
    const subscribeButton = screen.getByText(/Inscribir servicios/i);

    expect(rechargeButton).toBeInTheDocument();
    expect(subscribeButton).toBeInTheDocument();
  });

  test('should render buttons for "Últimos Pagos" and "Últimas transferencias"', () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Home />
      </AuthContext.Provider>
    );

    const lastPaymentsButton = screen.getByText(/Últimos Pagos/i);
    const lastTransfersButton = screen.getByText(/Últimas transferencias/i);

    expect(lastPaymentsButton).toBeInTheDocument();
    expect(lastTransfersButton).toBeInTheDocument();
  });

  test('should render buttons for "Crear Alcancía" and "Cargar mis alcancías"', () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Home />
      </AuthContext.Provider>
    );

    const createPiggyBankButton = screen.getByText(/Crear Alcancía/i);
    const loadPiggyBanksButton = screen.getByText(/Cargar mis alcancías/i);

    expect(createPiggyBankButton).toBeInTheDocument();
    expect(loadPiggyBanksButton).toBeInTheDocument();
  });

  test('should render a list of service buttons', () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Home />
      </AuthContext.Provider>
    );

    // Check for some specific buttons with icons
    const creditButton = screen.getByText(/Crédito de libre inversión/i);
    const creditCardButton = screen.getByText(/Tarjeta de crédito/i);
    const housingCreditButton = screen.getByText(/Crédito de vivienda/i);

    expect(creditButton).toBeInTheDocument();
    expect(creditCardButton).toBeInTheDocument();
    expect(housingCreditButton).toBeInTheDocument();
  });
});
