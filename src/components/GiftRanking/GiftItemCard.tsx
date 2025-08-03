import styled from '@emotion/styled';
import { Link, generatePath } from 'react-router-dom';
import type { GiftItem } from '@/constants/GiftItem';
import { PRODUCT_DETAIL_ROUTE } from '@/constants/path';

const GiftItemCard = ({ item }: { item: GiftItem }) => {
  const productDetailPath = generatePath(PRODUCT_DETAIL_ROUTE, { id: String(item.id) });

  return (
    <Card to={productDetailPath}>
      <Image src={item.imageURL} alt={item.name} />
      <Name>{item.name}</Name>
      <Brand>{item.brandName}</Brand>
      <Price>{item.price.sellingPrice.toLocaleString()}원</Price>
    </Card>
  );
};

export default GiftItemCard;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 8px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  margin-bottom: 8px;
`;

const Brand = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textColors.sub};
`;

const Price = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.textColors.default};
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin: 4px 0;
`;
