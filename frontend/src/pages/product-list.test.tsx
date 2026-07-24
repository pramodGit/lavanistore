// src/pages/product-list.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductListing from './product-list';
import api from '../utils/api';

vi.mock('../utils/api', () => ({
  default: { get: vi.fn() },
}));

vi.mock('../layout/header', () => ({ default: () => <div>Mock Header</div> }));
vi.mock('../layout/footer', () => ({ default: () => <div>Mock Footer</div> }));

// Fixed: use an attribute, not visible text, to avoid colliding with the
// real <figcaption> that also renders the product title
vi.mock('../components/AddToCart', () => ({
  AddToCartButton: ({ product }: { product: { name: string } }) => (
    <div data-testid="add-to-cart" data-product-name={product.name} />
  ),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

const mockProducts = [
  { id: 1, title: 'Laptop', price: 45000, mrp: 50000, categoryId: 1, image: 'laptop.jpg' },
  { id: 2, title: 'Phone', price: 20000, mrp: 22000, categoryId: 2, image: 'phone.jpg' },
];

const mockCategories = [
  { id: 1, label: 'Electronics' },
  { id: 2, label: 'Mobiles' },
];

describe('ProductListing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state before data arrives', () => {
    (api.get as any).mockReturnValue(new Promise(() => {}));

    render(<ProductListing />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders products and categories after successful fetch', async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/products') return Promise.resolve({ data: mockProducts });
      if (url === '/categories') return Promise.resolve({ data: mockCategories });
      return Promise.reject(new Error('unknown endpoint'));
    });

    render(<ProductListing />);

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Mobiles')).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();

    const cartButtons = screen.getAllByTestId('add-to-cart');
    expect(cartButtons).toHaveLength(2);
    expect(cartButtons[0]).toHaveAttribute('data-product-name', 'Laptop');
    expect(cartButtons[1]).toHaveAttribute('data-product-name', 'Phone');
  });

  it('shows correct product count matching total fetched products', async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/products') return Promise.resolve({ data: mockProducts });
      if (url === '/categories') return Promise.resolve({ data: mockCategories });
    });

    render(<ProductListing />);

    await waitFor(() => {
      expect(screen.getByText('2', { selector: '#productCount' })).toBeInTheDocument();
    });
  });

  it('filters products when a category checkbox is selected', async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/products') return Promise.resolve({ data: mockProducts });
      if (url === '/categories') return Promise.resolve({ data: mockCategories });
    });

    render(<ProductListing />);

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Electronics'));

    await waitFor(() => {
      expect(screen.queryByText('Phone')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });

  it('clears filters when "Clear All" is clicked', async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/products') return Promise.resolve({ data: mockProducts });
      if (url === '/categories') return Promise.resolve({ data: mockCategories });
    });

    render(<ProductListing />);

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Electronics'));
    await waitFor(() => {
      expect(screen.queryByText('Phone')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /clear all/i }));

    await waitFor(() => {
      expect(screen.getByText('Phone')).toBeInTheDocument();
    });
    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });

  it('stops loading and shows zero products if the API call fails', async () => {
    (api.get as any).mockRejectedValue(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ProductListing />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('0', { selector: '#productCount' })).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});