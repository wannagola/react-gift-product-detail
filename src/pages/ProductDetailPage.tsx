import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useProductDetailQuery } from '@/hooks/useProductDetailQuery';
import { useProductHighlightReviewQuery } from '@/hooks/useProductHighlightReviewQuery';
import { useProductWishQuery } from '@/hooks/useProductWishQuery';
import { useToggleProductWishMutation } from '@/hooks/useToggleProductWishMutation';
import Spinner from '@/components/common/Spinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { FiHeart } from 'react-icons/fi';

const ProductDetailPageContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProductDetailQuery(productId);
  const { data: reviews, isLoading: reviewsLoading } =
    useProductHighlightReviewQuery(productId);
  const { data: wishInfo, isLoading: wishLoading } =
    useProductWishQuery(productId);

  const { mutate: toggleWish } = useToggleProductWishMutation(productId);

  if (productLoading || reviewsLoading || wishLoading) {
    return <Spinner />;
  }

  if (productError) {
    return <ErrorText>상품 정보를 불러오는 데 실패했습니다.</ErrorText>;
  }

  if (!product) {
    return <ErrorText>상품을 찾을 수 없습니다.</ErrorText>;
  }

  const handleGiftButtonClick = () => {
    navigate(`/order/${productId}`);
  };

  const handleWishToggle = () => {
    toggleWish();
  };

  return (
    <Container>
      <ProductImage src={product?.imageURL} alt={product?.name} />
      <ProductInfo>
        <ProductName>{product?.name}</ProductName>
        <ProductPrice>
          {product?.price?.sellingPrice?.toLocaleString()}원
        </ProductPrice>
        <ProductDescription dangerouslySetInnerHTML={{ __html: product?.description || '' }} />

        {product.announcement && product.announcement.length > 0 && (
          <AnnouncementSection>
            <SectionTitle>상품 고시 정보</SectionTitle>
            {product.announcement.map((item, index) => (
              <AnnouncementItem key={index}>
                <AnnouncementName>{item.name}</AnnouncementName>
                <AnnouncementValue>{item.value}</AnnouncementValue>
              </AnnouncementItem>
            ))}
          </AnnouncementSection>
        )}

        {reviews && reviews.reviews.length > 0 && (
          <ReviewSection>
            <SectionTitle>
              하이라이트 리뷰 ({reviews.totalCount.toLocaleString()})
            </SectionTitle>
            {reviews.reviews.map((review) => (
              <ReviewItem key={review.id}>
                <ReviewAuthor>{review.authorName}</ReviewAuthor>
                <ReviewContent>{review.content}</ReviewContent>
              </ReviewItem>
            ))}
          </ReviewSection>
        )}

        <ActionButtonsContainer>
          <WishButton onClick={handleWishToggle} isWished={wishInfo?.isWished}>
            <FiHeart size={16} />
            <span>{wishInfo?.wishCount.toLocaleString()}</span>
          </WishButton>
          <GiftButton onClick={handleGiftButtonClick}>선물하기</GiftButton>
        </ActionButtonsContainer>
      </ProductInfo>
    </Container>
  );
};

const ProductDetailPage: React.FC = () => (
  <ErrorBoundary
    fallback={
      <ErrorText>상품 상세 페이지를 불러오는 중 오류가 발생했습니다.</ErrorText>
    }
  >
    <Suspense fallback={<Spinner />}>
      <ProductDetailPageContent />
    </Suspense>
  </ErrorBoundary>
);

export default ProductDetailPage;

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.spacing4};
  background-color: ${({ theme }) => theme.backgroundColors.default};
  min-height: 100vh;
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`;

const ProductInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.spacing4};
  background-color: ${({ theme }) => theme.colors.gray00};
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  overflow-x: hidden;
`;

const ProductName = styled.h1`
  font: ${({ theme }) => theme.typography.title1Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing2};
`;

const ProductPrice = styled.p`
  font: ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`;

const ProductDescription = styled.p`
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.sub};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.spacing6};
  word-break: break-word;

  img {
    max-width: 100%;
    height: auto;
  }
`;

const GiftButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.spacing3};
  background-color: ${({ theme }) => theme.sementicColors.kakaoYellow};
  color: #000000;
  font: ${({ theme }) => theme.typography.body1Bold};
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.sementicColors.kakaoYellowHover};
  }

  &:active {
    background-color: ${({ theme }) => theme.sementicColors.kakaoYellowActive};
  }
`;

const ErrorText = styled.p`
  color: red;
  text-align: center;
  margin: ${({ theme }) => theme.spacing.spacing4} 0;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.spacing2};
  margin-top: ${({ theme }) => theme.spacing.spacing6};
`;

const WishButton = styled.button<{ isWished?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: none;
  border: 1px solid ${({ theme }) => theme.borderColors.default};
  cursor: pointer;
  color: ${({ isWished, theme }) =>
    isWished ? theme.colors.red500 : theme.textColors.sub};

  svg {
    fill: ${({ isWished, theme }) =>
      isWished ? theme.colors.red500 : 'none'};
  }

  span {
    display: inline;
    margin-left: ${({ theme }) => theme.spacing.spacing1};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

const SectionTitle = styled.h2`
  font: ${({ theme }) => theme.typography.label2Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing2};
  margin-top: ${({ theme }) => theme.spacing.spacing6};
`;

const AnnouncementSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.spacing6};
`;

const AnnouncementItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.spacing2} 0;
  border-bottom: 1px solid ${({ theme }) => theme.borderColors.default};

  &:last-of-type {
    border-bottom: none;
  }
`;

const AnnouncementName = styled.span`
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.sub};
`;

const AnnouncementValue = styled.span`
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.default};
`;

const ReviewSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.spacing6};
`;

const ReviewItem = styled.div`
  background-color: ${({ theme }) => theme.colors.gray100};
  padding: ${({ theme }) => theme.spacing.spacing3};
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  margin-bottom: ${({ theme }) => theme.spacing.spacing2};
`;

const ReviewAuthor = styled.p`
  font: ${({ theme }) => theme.typography.body2Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing1};
`;

const ReviewContent = styled.p`
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.sub};
  line-height: 1.5;
`;
