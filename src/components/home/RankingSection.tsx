import React from 'react';
import styled from '@emotion/styled';
import { useRanking } from '@/hooks/useRanking';
import Spinner from '@/components/common/Spinner';
import GiftItemCard from '@/components/GiftRanking/GiftItemCard';
import GiftRankingFilter from '@/components/GiftRanking/GiftRankingFilter';
import type { FilterValue } from '@/types/giftRankingFilter.type';
import GiftRankingTab from '@/components/GiftRanking/GiftRankingTab';
import type { TabValue } from '@/constants/RankingTabs';

const PAGE_SIZE = 6;

const validTabs: TabValue[] = [
  'MANY_WISH',
  'MANY_RECEIVE',
  'MANY_WISH_RECEIVE',
];

const validFilters: FilterValue[] = ['ALL', 'FEMALE', 'MALE', 'TEEN'];

const RankingSection: React.FC = () => {
  const [filter, setFilter] = React.useState<FilterValue>(() => {
    const saved = localStorage.getItem('lastFilter') as FilterValue | null;
    return saved && validFilters.includes(saved) ? saved : 'ALL';
  });

  const [tab, setTab] = React.useState<TabValue>(() => {
    const saved = localStorage.getItem('lastTab') as TabValue | null;
    return saved && validTabs.includes(saved) ? saved : 'MANY_WISH';
  });

  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  React.useEffect(() => {
    localStorage.setItem('lastTab', tab);
    localStorage.setItem('lastFilter', filter);
    setVisibleCount(PAGE_SIZE);
  }, [tab, filter]);

  const { products, loading, error } = useRanking(filter, tab);

  console.log({ loading, error });

  if (loading) return <Spinner />;
  if (error)
    return (
      <Section>
        <SectionTitle>실시간 급상승 선물랭킹</SectionTitle>
        <GiftRankingFilter selected={filter} onChange={setFilter} />
        <GiftRankingTab selected={tab} onChange={setTab} />
        <ContentArea>
          <ErrorMsg>불러오는 중 오류가 발생했습니다.</ErrorMsg>
        </ContentArea>
      </Section>
    );

  const currentProducts = products || [];
  const visibleItems = currentProducts.slice(0, visibleCount);
  const hasMore = visibleCount < currentProducts.length;

  return (
    <Section>
      <SectionTitle>실시간 급상승 선물랭킹</SectionTitle>
      <GiftRankingFilter selected={filter} onChange={setFilter} />
      <GiftRankingTab selected={tab} onChange={setTab} />

      <ContentArea>
        {currentProducts.length === 0 ? (
          <ErrorMsg>상품이 없습니다.</ErrorMsg>
        ) : (
          <>
            <Grid>
              {visibleItems.map((p, idx) => (
                <CardWrapper key={p.id}>
                  <RankBadge rank={idx + 1}>{idx + 1}</RankBadge>
                  <GiftItemCard item={p} />
                </CardWrapper>
              ))}
            </Grid>
            {hasMore && (
              <MoreButton onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                더보기
              </MoreButton>
            )}
          </>
        )}
      </ContentArea>
    </Section>
  );
};

export default RankingSection;

const Section = styled.section`
  padding: ${({ theme }) =>
    `${theme.spacing.spacing6} ${theme.spacing.spacing4}`};
`;

const SectionTitle = styled.h2`
  ${({ theme }) => theme.typography.title2Bold};
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
  color: ${({ theme }) => theme.textColors.default};
`;

const ContentArea = styled.div`
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.spacing4};
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const CardWrapper = styled.li`
  position: relative;
`;

const RankBadge = styled.span<{ rank: number }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.spacing2};
  left: ${({ theme }) => theme.spacing.spacing2};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  line-height: 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray00};

  background: ${({ rank, theme }) =>
    rank <= 3 ? theme.colors.red500 : theme.colors.gray200};
`;

const MoreButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.spacing3} 0`};
  margin-top: ${({ theme }) => theme.spacing.spacing4};
  background: ${({ theme }) => theme.colors.gray100};
  border: 1px solid ${({ theme }) => theme.borderColors.default};
  border-radius: 8px;
  ${({ theme }) => theme.typography.body2Regular};
  cursor: pointer;
`;

const ErrorMsg = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.stateColors.critical};
  margin: ${({ theme }) => theme.spacing.spacing4} 0;
  ${({ theme }) => theme.typography.body2Regular};
`;
