// src/components/AddToCartButton.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AddToCartButton } from './AddToCart';
import cartReducer from '../store/cartSlice';
import authReducer from '../store/authSlice';

// Mock react-router-dom's useNavigate, keep everything else real
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const product = { id: '1', name: 'Laptop', price: 45000, mrp: 50000 };

// Helper: builds a real Redux store preloaded with a given auth state
function renderWithStore(user: { id: string; name: string; email: string } | null) {
  const store = configureStore({
    reducer: { auth: authReducer, cart: cartReducer },
    preloadedState: {
      auth: { user, csrfToken: null },
      cart: { items: [], gstRates: [] },
    },
  });

  render(
    <Provider store={store}>
      <AddToCartButton product={product} />
    </Provider>
  );

  return store;
}

describe('AddToCartButton', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('redirects to login when user is not logged in, and does not add to cart', () => {
    const store = renderWithStore(null);

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/auth/login', {
      state: { from: window.location.pathname },
    });
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it('adds item to cart with default quantity 1 when user is logged in', () => {
    const store = renderWithStore({ id: 'u1', name: 'Test User', email: 'test@example.com' });

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(store.getState().cart.items).toEqual([
      { id: '1', name: 'Laptop', mrp: 50000, salePrice: 45000, quantity: 1 },
    ]);
  });

  it('respects the quantity stepper before adding to cart', () => {
    const store = renderWithStore({ id: 'u1', name: 'Test User', email: 'test@example.com' });

    // Click "+" twice → quantity becomes 3
    fireEvent.click(screen.getByRole('button', { name: /increase quantity/i }));
    fireEvent.click(screen.getByRole('button', { name: /increase quantity/i }));

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(store.getState().cart.items[0].quantity).toBe(3);
  });
});