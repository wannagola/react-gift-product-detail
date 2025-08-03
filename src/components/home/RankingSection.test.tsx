import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RankingSection from './RankingSection';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/constants/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthProvider';
import { apiClient } from '@/api/apiClient';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/utils/localStorage', () => ({
  getUserFromStorage: vi.fn(() => null),
  setUserToStorage: vi.fn(),
  clearUserStorage: vi.fn(),
}));

const queryClient = new QueryClient();

const renderWithAllProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <MemoryRouter>{ui}</MemoryRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('RankingSection', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('renders loading spinner initially', () => {
    renderWithAllProviders(<RankingSection />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays products after successful data fetch', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 1,
            name: 'Product 1',
            price: { basicPrice: 10000, sellingPrice: 9000, discountRate: 10 },
            imageURL: 'http://example.com/image1.jpg',
            brandName: 'Brand A',
          },
          {
            id: 2,
            name: 'Product 2',
            price: { basicPrice: 20000, sellingPrice: 18000, discountRate: 10 },
            imageURL: 'http://example.com/image2.jpg',
            brandName: 'Brand B',
          },
          {
            id: 3,
            name: 'Product 3',
            price: { basicPrice: 30000, sellingPrice: 27000, discountRate: 10 },
            imageURL: 'http://example.com/image3.jpg',
            brandName: 'Brand C',
          },
          {
            id: 4,
            name: 'Product 4',
            price: { basicPrice: 40000, sellingPrice: 36000, discountRate: 10 },
            imageURL: 'http://example.com/image4.jpg',
            brandName: 'Brand D',
          },
          {
            id: 5,
            name: 'Product 5',
            price: { basicPrice: 50000, sellingPrice: 45000, discountRate: 10 },
            imageURL: 'http://example.com/image5.jpg',
            brandName: 'Brand E',
          },
          {
            id: 6,
            name: 'Product 6',
            price: { basicPrice: 60000, sellingPrice: 54000, discountRate: 10 },
            imageURL: 'http://example.com/image6.jpg',
            brandName: 'Brand F',
          },
          {
            id: 7,
            name: 'Product 7',
            price: { basicPrice: 70000, sellingPrice: 63000, discountRate: 10 },
            imageURL: 'http://example.com/image7.jpg',
            brandName: 'Brand G',
          },
        ],
      },
    });

    renderWithAllProviders(<RankingSection />);

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Product 7')).not.toBeInTheDocument();
  });

  it('loads more products when "더보기" button is clicked', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: {
        data: [...Array(7)].map((_, idx) => ({
          id: idx + 1,
          name: `Product ${idx + 1}`,
          price: { basicPrice: 10000, sellingPrice: 9000, discountRate: 10 },
          imageURL: `http://example.com/image${idx + 1}.jpg`,
          brandName: 'Brand A',
        })),
      },
    });

    renderWithAllProviders(<RankingSection />);

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    );

    const moreButton = screen.getByRole('button', { name: '더보기' });
    await userEvent.click(moreButton);

    await waitFor(() =>
      expect(screen.getByText('Product 7')).toBeInTheDocument()
    );
  });

  it('changes filter and loads new data', async () => {
    vi.spyOn(apiClient, 'get').mockImplementation(
      (_, config = { params: {} }) => {
        const { targetType = 'ALL', rankType = 'MANY_WISH' } = config.params;

        if (targetType === 'ALL' && rankType === 'MANY_WISH') {
          return Promise.resolve({
            data: {
              data: [
                {
                  id: 1,
                  name: 'Product 1',
                  price: {
                    basicPrice: 10000,
                    sellingPrice: 9000,
                    discountRate: 10,
                  },
                  imageURL: 'http://example.com/image1.jpg',
                  brandName: 'Brand A',
                },
              ],
            },
          });
        } else if (targetType === 'FEMALE' && rankType === 'MANY_WISH') {
          return Promise.resolve({
            data: {
              data: [
                {
                  id: 2,
                  name: 'Female Product 1',
                  price: {
                    basicPrice: 10000,
                    sellingPrice: 9000,
                    discountRate: 10,
                  },
                  imageURL: 'http://example.com/image2.jpg',
                  brandName: 'Brand B',
                },
              ],
            },
          });
        }

        return Promise.resolve({ data: { data: [] } });
      }
    );

    renderWithAllProviders(<RankingSection />);

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();

    const femaleButton = screen.getByRole('button', { name: /여성이/ });
    await userEvent.click(femaleButton);

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    );

    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
    expect(screen.getByText('Female Product 1')).toBeInTheDocument();
  });

  it('displays error message when data fetch fails', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('API Error'));

    renderWithAllProviders(<RankingSection />);

    await waitFor(() =>
      expect(
        screen.getByText('불러오는 중 오류가 발생했습니다.')
      ).toBeInTheDocument()
    );
  });
});
