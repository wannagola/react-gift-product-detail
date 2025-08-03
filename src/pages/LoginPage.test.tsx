import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './loginpage';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/constants/theme';
import { AuthProvider } from '@/contexts/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockNavigate = vi.fn();
const mockUseLocation = vi.fn<() => { state?: { from?: string } }>(() => ({
  state: { from: '/previous-page' },
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  };
});

vi.mock('@/components/common/LoginFormSection', () => ({
  default: ({ onLoginSuccess }: { onLoginSuccess: () => void }) => (
    <button onClick={onLoginSuccess}>Mock Login Button</button>
  ),
}));



const queryClient = new QueryClient();

const renderWithAllProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>{ui}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue({ state: { from: '/previous-page' } });
    vi.spyOn(window.localStorage, 'getItem').mockReturnValue(null);
  });

  it('로고와 LoginFormSection이 보여야 한다', () => {
    renderWithAllProviders(<LoginPage />);

    expect(screen.getByText('kakao')).toBeInTheDocument();
    expect(screen.getByText('Mock Login Button')).toBeInTheDocument();
  });

  it('로그인 성공 시 이전 페이지로 이동해야 한다', async () => {
    renderWithAllProviders(<LoginPage />);

    const loginButton = screen.getByText('Mock Login Button');
    await userEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/previous-page', {
      replace: true,
    });
  });

  it('이전 페이지 정보가 없으면 루트(/)로 이동해야 한다', async () => {
    mockUseLocation.mockReturnValue({ state: {} });
    renderWithAllProviders(<LoginPage />);

    const loginButton = screen.getByText('Mock Login Button');
    await userEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  // it('이미 로그인된 사용자는 로그인 페이지 접근 시 홈(/)으로 리디렉션된다', () => {
  //   vi.spyOn(window.localStorage, 'getItem').mockReturnValue(JSON.stringify({
  //     email: 'test@kakao.com',
  //     name: 'Test User',
  //     authToken: 'mock-auth-token',
  //   }));
  //   renderWithAllProviders(<LoginPage />);

  //   expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  // });
});
