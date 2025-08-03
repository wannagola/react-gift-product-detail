import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import GiftRankingTab from './GiftRankingTab';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/constants/theme';
import { tabs } from '@/constants/RankingTabs';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('GiftRankingTab', () => {
  it('모든 탭이 올바르게 렌더링된다', () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <GiftRankingTab selected="MANY_WISH" onChange={mockOnChange} />
    );

    tabs.forEach((tab) => {
      expect(
        screen.getByRole('button', { name: tab.label })
      ).toBeInTheDocument();
    });
  });

  it('선택된 탭이 강조된다', () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <GiftRankingTab selected="MANY_RECEIVE" onChange={mockOnChange} />
    );

    expect(screen.getByRole('button', { name: '많이 선물한' })).toHaveStyle(
      `font-weight: 700`
    );
    expect(screen.getByRole('button', { name: '많이 찜한' })).toHaveStyle(
      `font-weight: 500`
    );
  });

  it('탭 클릭 시 올바른 값으로 onChange가 호출된다', async () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <GiftRankingTab selected="MANY_WISH" onChange={mockOnChange} />
    );

    for (const tab of tabs) {
      const tabButton = screen.getByRole('button', { name: tab.label });
      await userEvent.click(tabButton);
      expect(mockOnChange).toHaveBeenCalledWith(tab.value);
      mockOnChange.mockClear();
    }
  });
});
