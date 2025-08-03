import styled from '@emotion/styled';
import { Recipient } from '@/types/order';

type Props = {
  recipients: Recipient[];
  onEdit: () => void;
  unitPrice: number;
};

const RecipientsList = ({ recipients, onEdit, unitPrice }: Props) => {
  const totalPrice = recipients.reduce(
    (sum, r) => sum + r.quantity * unitPrice,
    0
  );

  return (
    <Wrapper>
      <Header>
        <span>받는 사람</span>
        <EditButton onClick={onEdit}>수정</EditButton>
      </Header>
      <List>
        {recipients.map((r, i) => (
          <li key={i}>
            {r.name} ({r.phoneNumber}) - {r.quantity}개
          </li>
        ))}
      </List>
      <OrderButton>{totalPrice.toLocaleString()}원 주문하기</OrderButton>
    </Wrapper>
  );
};

export default RecipientsList;

const Wrapper = styled.div`
  border-top: 1px solid #eee;
  padding-top: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const EditButton = styled.button`
  font-size: 13px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray00};
  cursor: pointer;
`;

const List = styled.ul`
  font-size: 14px;
  color: #333;
  margin-bottom: 16px;

  li {
    margin-bottom: 4px;
  }
`;

const OrderButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.sementicColors.kakaoYellow};
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: bold;
  font-size: 16px;
`;
