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

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

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

  it('초기 로딩 스피너가 렌더링된다', () => {
    renderWithAllProviders(<RankingSection />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('데이터를 성공적으로 불러온 후 상품을 표시한다', async () => {
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

  it('"더보기" 버튼 클릭 시 더 많은 상품을 로드한다', async () => {
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

  it('필터를 변경하고 새로운 데이터를 로드한다', async () => {
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

  it('데이터 불러오기 실패 시 에러 메시지를 표시한다', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('API Error'));

    renderWithAllProviders(<RankingSection />);

    await waitFor(() => {
      expect(screen.getByText('불러오는 중 오류가 발생했습니다.')).toBeInTheDocument();
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('초기에 제목과 모든 필터/탭 버튼이 렌더링된다', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { data: [] } });
    renderWithAllProviders(<RankingSection />);

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    );

    expect(screen.getByText('실시간 급상승 선물랭킹')).toBeInTheDocument();

    // Filter buttons
    expect(screen.getByRole('button', { name: /전체/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /여성이/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /남성이/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /청소년이/ })).toBeInTheDocument();

    // Tab buttons
    expect(screen.getByRole('button', { name: /많이 찜한/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /많이 선물한/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /많이 찜하고 받은/ })).toBeInTheDocument();
  });

  it('localStorage에서 기본 필터 및 탭 값을 적용한다', async () => {
    localStorageMock.setItem('lastFilter', 'FEMALE');
    localStorageMock.setItem('lastTab', 'MANY_RECEIVE');

    vi.spyOn(apiClient, 'get').mockImplementation(
      (_, config = { params: {} }) => {
        const { targetType, rankType } = config.params;
        if (targetType === 'FEMALE' && rankType === 'MANY_RECEIVE') {
          return Promise.resolve({
            data: {
              data: [
                {
                  id: 100,
                  name: 'Default Female Received Product',
                  price: { basicPrice: 1, sellingPrice: 1, discountRate: 0 },
                  imageURL: '',
                  brandName: '',
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

    expect(screen.getByRole('button', { name: /여성이/ })).toHaveStyle(
      `background-color: ${theme.colors.blue700}`
    );
    expect(screen.getByRole('button', { name: /많이 선물한/ })).toHaveStyle(
      `font-weight: 700`
    );
    expect(
      screen.getByText('Default Female Received Product')
    ).toBeInTheDocument();
  });

  it('필터 버튼에 올바른 아이콘이 표시된다', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { data: [] } });
    renderWithAllProviders(<RankingSection />);

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    );

    expect(screen.getByRole('button', { name: /여성이/ })).toHaveTextContent(
      '👩여성이'
    );
    expect(screen.getByRole('button', { name: /남성이/ })).toHaveTextContent(
      '👨남성이'
    );
    expect(screen.getByRole('button', { name: /청소년이/ })).toHaveTextContent(
      '🧒청소년이'
    );
  });

  it('상품이 없을 때 "상품이 없습니다." 메시지를 표시한다', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { data: [] } });
    renderWithAllProviders(<RankingSection />);

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    );

    expect(screen.getByText('상품이 없습니다.')).toBeInTheDocument();
  });

  it('탭을 변경하고 새로운 데이터를 로드한다', async () => {
    vi.spyOn(apiClient, 'get').mockImplementation(
      (_, config = { params: {} }) => {
        const { targetType = 'ALL', rankType = 'MANY_WISH' } = config.params;

        if (targetType === 'ALL' && rankType === 'MANY_WISH') {
          return Promise.resolve({
            data: {
              data: [
                {
                  id: 1,
                  name: 'Product 1 (Many Wish)',
                  price: { basicPrice: 1, sellingPrice: 1, discountRate: 0 },
                  imageURL: '',
                  brandName: '',
                },
              ],
            },
          });
        } else if (targetType === 'ALL' && rankType === 'MANY_RECEIVE') {
          return Promise.resolve({
            data: {
              data: [
                {
                  id: 2,
                  name: 'Product 2 (Many Receive)',
                  price: { basicPrice: 1, sellingPrice: 1, discountRate: 0 },
                  imageURL: '',
                  brandName: '',
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
    , { timeout: 5000 });

    expect(await screen.findByText('Product 1 (Many Wish)')).toBeInTheDocument();

    const manyReceiveButton = screen.getByRole('button', { name: /많이 선물한/ });
    await userEvent.click(manyReceiveButton);

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    );

    expect(screen.queryByText('Product 1 (Many Wish)')).not.toBeInTheDocument();
    expect(screen.getByText('Product 2 (Many Receive)')).toBeInTheDocument();
  });

  it('필터와 탭 조합 변경을 올바르게 처리한다', async () => {
    vi.spyOn(apiClient, 'get').mockImplementation(
      (_, config = { params: {} }) => {
        const { targetType = 'ALL', rankType = 'MANY_WISH' } = config.params;

        if (targetType === 'ALL' && rankType === 'MANY_WISH') {
          return Promise.resolve({
            data: {
              data: [
                {
                  id: 1,
                  name: 'Product ALL-MANY_WISH',
                  price: { basicPrice: 1, sellingPrice: 1, discountRate: 0 },
                  imageURL: '',
                  brandName: '',
                },
              ],
            },
          });
        } else if (targetType === 'MALE' && rankType === 'MANY_RECEIVE') {
          return Promise.resolve({
            data: {
              data: [
                {
                  id: 2,
                  name: 'Product MALE-MANY_RECEIVE',
                  price: { basicPrice: 1, sellingPrice: 1, discountRate: 0 },
                  imageURL: '',
                  brandName: '',
                },
              ],
            },
          });
        } else if (targetType === 'TEEN' && rankType === 'MANY_WISH_RECEIVE') {
          return Promise.resolve({
            data: {
              data: [
                {
                  id: 3,
                  name: 'Product TEEN-MANY_WISH_RECEIVE',
                  price: { basicPrice: 1, sellingPrice: 1, discountRate: 0 },
                  imageURL: '',
                  brandName: '',
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
    , { timeout: 5000 });

        renderWithAllProviders(<RankingSection />);

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    , { timeout: 5000 });

        renderWithAllProviders(<RankingSection />);

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    , { timeout: 5000 });

    expect(await screen.findByText('Product ALL-MANY_WISH')).toBeInTheDocument();

    // Male filter
    await userEvent.click(screen.getByRole('button', { name: /남성/ }));
    // Many Receive tab
    await userEvent.click(screen.getByRole('button', { name: /많이 선물한/ }));

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    );
    expect(screen.getByText('Product MALE-MANY_RECEIVE')).toBeInTheDocument();

    // Teen filter
    await userEvent.click(screen.getByRole('button', { name: /청소년/ }));
    // Many Wish & Receive tab
    await userEvent.click(
      screen.getByRole('button', { name: /많이 찜하고 받은/ })
    );

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    );
    expect(
      screen.getByText('Product TEEN-MANY_WISH_RECEIVE')
    ).toBeInTheDocument();
  });
});
