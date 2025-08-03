import React, { useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Spinner from '@/components/common/Spinner';
import { useThemeDetail } from '@/hooks/useThemeDetail';
import { useThemeProducts } from '@/hooks/useThemeProducts';
import GiftItemCard from '@/components/GiftRanking/GiftItemCard';
import { GiftItem } from '@/constants/GiftItem';

const ThemeProductListPage: React.FC = () => {
  const { themeId: themeIdParam } = useParams<{ themeId: string }>();
  const themeId = Number(themeIdParam);
  const navigate = useNavigate();

  const {
    theme,
    loading: themeLoading,
    error: themeError,
  } = useThemeDetail(themeId);

  const {
    products,
    loading: productsLoading,
    error: productsError,
    fetchMore,
    hasMore,
  } = useThemeProducts(themeId);

  const observerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  

  useEffect(() => {
    if (themeError && themeError.message.includes('404')) {
      navigate('/');
    }
  }, [themeError, navigate]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !productsLoading) {
        fetchMore();
      }
    },
    [hasMore, productsLoading, fetchMore]
  );

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });

    if (observerRef.current) {
      observer.current.observe(observerRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleObserver]);

  

  if (themeLoading) {
    return <Spinner />;
  }

  if (themeError) {
    return <ErrorText>테마 정보를 불러오는 중 오류가 발생했습니다.</ErrorText>;
  }

  if (!theme) {
    return <ErrorText>테마를 찾을 수 없습니다.</ErrorText>;
  }

  return (
    <Container>
      <HeroSection backgroundColor={theme.backgroundColor}>
        <HeroTitle>{theme.title}</HeroTitle>
        <HeroDescription>{theme.description}</HeroDescription>
      </HeroSection>

      <ProductListSection>
        {productsLoading && products.length === 0 ? (
          <Spinner />
        ) : productsError ? (
          <ErrorText>상품 목록을 불러오는 중 오류가 발생했습니다.</ErrorText>
        ) : products.length === 0 ? (
          <EmptyState>상품이 없습니다.</EmptyState>
        ) : (
          <ProductGrid>
            {products.map((product: GiftItem) => (
              <GiftItemCard key={product.id} item={product} />
            ))}
          </ProductGrid>
        )}
        {productsLoading && products.length > 0 && <Spinner />}
        <div ref={observerRef} style={{ height: '1px' }} />
      </ProductListSection>
    </Container>
  );
};

export default ThemeProductListPage;

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColors.default};
  min-height: 100vh;
`;

const HeroSection = styled.div<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  padding: 40px 20px;
  text-align: center;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const HeroDescription = styled.p`
  font-size: 16px;
  line-height: 1.5;
`;

const ProductListSection = styled.div`
  padding: 20px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: ${({ theme }) => theme.textColors.sub};
`;

const ErrorText = styled.p`
  color: red;
  text-align: center;
  margin: 20px 0;
`;
