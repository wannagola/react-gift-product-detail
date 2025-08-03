import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import GiftRankingFilter from './GiftRankingFilter';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/constants/theme';
import { filters } from '@/constants/giftRankingFilter.const';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('GiftRankingFilter', () => {
  it('모든 필터가 올바르게 렌더링된다', () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <GiftRankingFilter selected="ALL" onChange={mockOnChange} />
    );

    filters.forEach((filter) => {
      expect(screen.getByRole('button', { name: new RegExp(filter.label) })).toBeInTheDocument();
    });
  });

  it('선택된 필터가 강조된다', () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <GiftRankingFilter selected="FEMALE" onChange={mockOnChange} />
    );

    expect(screen.getByRole('button', { name: /여성이/ })).toHaveStyle(
      `background-color: ${theme.colors.blue700}`
    );
    expect(screen.getByRole('button', { name: /전체/ })).toHaveStyle(
      `background-color: ${theme.colors.blue100}`
    );
  });

  it('필터 클릭 시 올바른 값으로 onChange가 호출된다', async () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <GiftRankingFilter selected="ALL" onChange={mockOnChange} />
    );

    const femaleFilter = screen.getByRole('button', { name: /여성/ });
    await userEvent.click(femaleFilter);

    expect(mockOnChange).toHaveBeenCalledWith('FEMALE');
  });

  it('필터 버튼에 올바른 아이콘이 표시된다', () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <GiftRankingFilter selected="ALL" onChange={mockOnChange} />
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
    expect(screen.getByRole('button', { name: /전체/ })).not.toHaveTextContent(
      /\s[👩👨🧑]/u // No icon for '전체'
    );
  });
});
