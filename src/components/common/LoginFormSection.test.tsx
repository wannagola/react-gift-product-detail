import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginFormSection from './LoginFormSection';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/constants/theme';
import { AuthProvider } from '@/contexts/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/utils/localStorage', () => ({
  getUserFromStorage: vi.fn(() => null),
  setUserToStorage: vi.fn(),
  clearUserStorage: vi.fn(),
}));

vi.mock('@/hooks/useLoginMutation', () => ({
  useLoginMutation: () => ({
    mutate: vi.fn((_variables, { onSuccess }) => {
      onSuccess({
        data: {
          email: 'test@kakao.com',
          name: 'Test User',
          authToken: 'mock-auth-token',
        },
      });
    }),
  }),
}));

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>{ui}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('LoginFormSection', () => {
  it('renders email and password inputs and a disabled login button', () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);

    expect(
      screen.getByPlaceholderText('이메일 (@kakao.com)')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
  });

  it('shows an error message for an invalid email', async () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const emailInput = screen.getByPlaceholderText('이메일 (@kakao.com)');

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab();

    expect(
      await screen.findByText('ID는 이메일 형식이어야 합니다.')
    ).toBeInTheDocument();
  });

  it('shows an error message for a password shorter than 8 characters', async () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const passwordInput = screen.getByPlaceholderText('비밀번호');

    await userEvent.type(passwordInput, '1234567');
    await userEvent.tab();

    expect(
      await screen.findByText('PW는 최소 8글자 이상이어야 합니다.')
    ).toBeInTheDocument();
  });

  it('enables the login button when both inputs are valid', async () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const emailInput = screen.getByPlaceholderText('이메일 (@kakao.com)');
    const passwordInput = screen.getByPlaceholderText('비밀번호');

    await userEvent.type(emailInput, 'test@kakao.com');
    await userEvent.type(passwordInput, 'password123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '로그인' })).toBeEnabled();
    });
  });

  it('calls onLoginSuccess when the login button is clicked', async () => {
    const handleLoginSuccess = vi.fn();
    renderWithProviders(
      <LoginFormSection onLoginSuccess={handleLoginSuccess} />
    );
    const emailInput = screen.getByPlaceholderText('이메일 (@kakao.com)');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const loginButton = screen.getByRole('button', { name: '로그인' });

    await userEvent.type(emailInput, 'test@kakao.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    expect(handleLoginSuccess).toHaveBeenCalledTimes(1);
  });
});
