import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, Mock } from 'vitest';
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

import { useLoginMutation, LoginResponse, LoginPayload } from '@/hooks/useLoginMutation';
import { AxiosError } from 'axios';
import { UseMutationResult } from '@tanstack/react-query';

vi.mock('@/hooks/useLoginMutation', () => ({
  useLoginMutation: vi.fn(),
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
  it('이메일, 비밀번호 입력 필드와 비활성화된 로그인 버튼이 렌더링된다', () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    expect(
      screen.getByPlaceholderText('이메일 (@kakao.com)')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
  });

  it('유효하지 않은 이메일에 대해 에러 메시지를 보여준다', async () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const emailInput = screen.getByPlaceholderText('이메일 (@kakao.com)');
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab();
    expect(
      await screen.findByText('ID는 이메일 형식이어야 합니다.')
    ).toBeInTheDocument();
  });

  it('8자 미만 비밀번호에 대해 에러 메시지를 보여준다', async () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    await userEvent.type(passwordInput, '1234567');
    await userEvent.tab();
    expect(
      await screen.findByText('PW는 최소 8글자 이상이어야 합니다.')
    ).toBeInTheDocument();
  });

  it('유효한 이메일과 비밀번호 입력 시 로그인 버튼이 활성화된다', async () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const emailInput = screen.getByPlaceholderText('이메일 (@kakao.com)');
    const passwordInput = screen.getByPlaceholderText('비밀번호');

    await userEvent.type(emailInput, 'test@kakao.com');
    await userEvent.type(passwordInput, 'password123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '로그인' })).toBeEnabled();
    });
  });

  it('로그인 버튼 클릭 시 onLoginSuccess가 호출된다', async () => {
    const handleLoginSuccess = vi.fn();

    (vi.mocked(useLoginMutation) as unknown as Mock<() => UseMutationResult<LoginResponse, AxiosError<LoginResponse>, LoginPayload>>).mockReturnValue({
      mutate: vi.fn((_variables, { onSuccess }) => {
        onSuccess({
          data: {
            email: 'test@kakao.com',
            name: 'Test User',
            authToken: 'mock-auth-token',
          },
        });
      }),
      data: undefined,
      error: null,
      isIdle: false,
      isLoading: false,
      isPaused: false,
      isSuccess: false,
      isError: false,
      isSettled: false,
      status: 'idle',
      reset: vi.fn(),
      variables: undefined,
      submittedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
    });

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
    expect(vi.mocked(localStorage).setUserToStorage).toHaveBeenCalledWith({
      email: 'test@kakao.com',
      name: 'Test User',
      authToken: 'mock-auth-token',
    });
  });

  it('이메일이 비어있을 때 에러 메시지를 보여준다', async () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const emailInput = screen.getByPlaceholderText('이메일 (@kakao.com)');
    await userEvent.type(emailInput, ' ');
    await userEvent.tab();
    expect(await screen.findByText('ID를 입력해주세요.')).toBeInTheDocument();
  });

  it('@kakao.com 도메인이 아닐 때 에러 메시지를 보여준다', async () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const emailInput = screen.getByPlaceholderText('이메일 (@kakao.com)');
    await userEvent.type(emailInput, 'test@gmail.com');
    await userEvent.tab();
    expect(
      await screen.findByText('ID는 @kakao.com 도메인이어야 합니다.')
    ).toBeInTheDocument();
  });

  it('유효한 이메일 입력 시 에러 메시지가 사라진다', async () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const emailInput = screen.getByPlaceholderText('이메일 (@kakao.com)');

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab();
    expect(
      await screen.findByText('ID는 이메일 형식이어야 합니다.')
    ).toBeInTheDocument();

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'valid@kakao.com');
    await userEvent.tab();

    await waitFor(() => {
      expect(
        screen.queryByText('ID는 이메일 형식이어야 합니다.')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('ID는 @kakao.com 도메인이어야 합니다.')
      ).not.toBeInTheDocument();
    });
  });

  it('비밀번호가 비어있을 때 에러 메시지를 보여준다', async () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    await userEvent.type(passwordInput, ' ');
    await userEvent.tab();
    expect(await screen.findByText('PW를 입력해주세요.')).toBeInTheDocument();
  });

  it('유효한 비밀번호 입력 시 에러 메시지가 사라진다', async () => {
    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const passwordInput = screen.getByPlaceholderText('비밀번호');

    await userEvent.type(passwordInput, '123');
    await userEvent.tab();
    expect(
      await screen.findByText('PW는 최소 8글자 이상이어야 합니다.')
    ).toBeInTheDocument();

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'password123');
    await userEvent.tab();

    await waitFor(() => {
      expect(
        screen.queryByText('PW는 최소 8글자 이상이어야 합니다.')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('PW를 입력해주세요.')).not.toBeInTheDocument();
    });
  });

  it('로그인 실패 시 에러 메시지를 보여주고 입력값을 유지한다', async () => {
    (vi.mocked(useLoginMutation) as unknown as Mock<() => UseMutationResult<LoginResponse, AxiosError<LoginResponse>, LoginPayload>>).mockReturnValue({
      mutate: vi.fn((_variables, { onError }) => {
        onError({
          response: {
            data: { message: '로그인에 실패했습니다.' },
            status: 401,
            statusText: 'Unauthorized',
            headers: {},
            config: {},
          },
        });
      }),
      data: undefined,
      error: null,
      isIdle: false,
      isLoading: false,
      isPaused: false,
      isSuccess: false,
      isError: false,
      isSettled: false,
      status: 'idle',
      reset: vi.fn(),
      variables: undefined,
      submittedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
    });

    renderWithProviders(<LoginFormSection onLoginSuccess={() => {}} />);
    const emailInput = screen.getByPlaceholderText('이메일 (@kakao.com)');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const loginButton = screen.getByRole('button', { name: '로그인' });

    await userEvent.type(emailInput, 'fail@kakao.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(loginButton);

    expect(
      await screen.findByText('로그인에 실패했습니다.')
    ).toBeInTheDocument();
    expect(emailInput).toHaveValue('fail@kakao.com');
    expect(passwordInput).toHaveValue('wrongpassword');
    expect(loginButton).toBeEnabled();
  });
});
