/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { theme } from '@/constants/theme';
import { useLoginForm } from '@/hooks/useLoginForm';

type Props = { onLoginSuccess: () => void };

const LoginFormSection = ({ onLoginSuccess }: Props) => {
  const {
    id,
    pw,
    setId,
    setPw,
    idError,
    pwError,
    validateId,
    validatePw,
    handleLogin,
  } = useLoginForm({ onLoginSuccess });

  const isValidPassword = pw.length >= 8;
  const isDisabled = !id || !isValidPassword || !!idError || !!pwError;

  return (
    <div css={wrapper}>
      <div css={form}>
        <div css={inputGroup}>
          <input
            type="text"
            placeholder="이메일 (@kakao.com)"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onBlur={validateId}
            css={input}
          />
          {idError && <p css={errorText}>{idError}</p>}
        </div>

        <div css={inputGroup}>
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onBlur={validatePw}
            css={input}
          />
          {pwError && <p css={errorText}>{pwError}</p>}
        </div>

        <button
          onClick={handleLogin}
          disabled={isDisabled}
          css={button(isDisabled)}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginFormSection;

const wrapper = css`
  width: 100%;
  padding: 0 ${theme.spacing.spacing4};
  margin-top: ${theme.spacing.spacing14}; // 56px
`;

const form = css`
  display: flex;
  flex-direction: column;
`;

const inputGroup = css`
  margin-bottom: ${theme.spacing.spacing8}; // 32px
`;

const input = css`
  width: 100%;
  border: none;
  border-bottom: 1px solid ${theme.borderColors.default};
  padding: ${theme.spacing.spacing2} 0;
  font: ${theme.typography.body1Regular};
  color: ${theme.textColors.default};

  ::placeholder {
    color: ${theme.textColors.placeholder};
  }

  &:focus {
    outline: none;
    border-bottom-color: ${theme.sementicColors.kakaoYellow};
  }
`;

const errorText = css`
  margin-top: ${theme.spacing.spacing1}; // 4px
  color: ${theme.stateColors.critical};
  font: ${theme.typography.label2Regular}; // 12px
`;

const button = (disabled: boolean) => css`
  width: 100%;
  height: ${theme.spacing.spacing12}; // 48px
  background-color: ${disabled
    ? theme.backgroundColors.disabled
    : theme.sementicColors.kakaoYellow};
  color: ${theme.textColors.default};
  border: none;
  border-radius: ${theme.spacing.spacing1}; // 4px
  font: ${theme.typography.body1Bold};
  cursor: ${disabled ? 'default' : 'pointer'};
`;
