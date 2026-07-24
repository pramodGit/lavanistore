// src/components/CartItem.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CartItem from './CartItem';
import cartReducer, { incrementQuantity, decrementQuantity, removeItem } from '../store/cartSlice';
import authReducer from '../store/authSlice';

function renderWithStore(isGreen: number, cartItem: any) {
  const store = configureStore({
    reducer: { auth: authReducer, cart: cartReducer },
    preloadedState: {
      auth: {
        user: { id: 'u1', name: 'Test', email: 't@test.com', isGreen },
        csrfToken: null,
      },
      cart: { items: [cartItem], gstRates: [] },
    },
  });

  const dispatchSpy = vi.spyOn(store, 'dispatch');

  render(
    <Provider store={store}>
      <CartItem id={cartItem.id} />
    </Provider>
  );

  return { store, dispatchSpy };
}

const baseItem = { id: '1', name: 'Laptop', mrp: 50000, salePrice: 45000, quantity: 2 };

describe('CartItem', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows only MRP for a non-green user (no strikethrough)', () => {
    renderWithStore(0, baseItem);
    expect(screen.getByText('₹50000.00')).toBeInTheDocument();
    expect(screen.queryByText('₹45000.00')).not.toBeInTheDocument();
  });

  it('shows struck-through MRP and sale price for a green user', () => {
    renderWithStore(1, baseItem);
    expect(screen.getByText('₹50000.00')).toBeInTheDocument();
    expect(screen.getByText('₹45000.00')).toBeInTheDocument();
  });

  it('computes subtotal using salePrice for green users', () => {
    renderWithStore(1, baseItem);
    expect(screen.getByText('₹90000.00')).toBeInTheDocument();
  });

  it('computes subtotal using mrp for non-green users', () => {
    renderWithStore(0, baseItem);
    expect(screen.getByText('₹100000.00')).toBeInTheDocument();
  });

  it('dispatches incrementQuantity when "+" is clicked', async () => {
    const { dispatchSpy } = renderWithStore(0, baseItem);

    await act(async () => {
      fireEvent.click(screen.getByText('+'));
    });

    expect(dispatchSpy).toHaveBeenCalledWith(incrementQuantity('1'));
  });

  it('dispatches decrementQuantity when "−" is clicked', async () => {
    const { dispatchSpy } = renderWithStore(0, baseItem);

    await act(async () => {
      fireEvent.click(screen.getByText('−'));
    });

    expect(dispatchSpy).toHaveBeenCalledWith(decrementQuantity('1'));
  });

  it('dispatches removeItem when "×" is clicked', async () => {
    const { dispatchSpy } = renderWithStore(0, baseItem);

    await act(async () => {
      fireEvent.click(screen.getByText('×'));
    });

    expect(dispatchSpy).toHaveBeenCalledWith(removeItem('1'));
  });

  it('renders nothing if the item is not found in the cart', () => {
    const store = configureStore({
      reducer: { auth: authReducer, cart: cartReducer },
      preloadedState: {
        auth: { user: null, csrfToken: null },
        cart: { items: [], gstRates: [] },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <CartItem id="1" />
      </Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });
});