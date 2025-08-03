import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GiftItem } from '@/constants/GiftItem';
import { Recipient } from '@/types/order';

export type OrderFormData = {
  sender: string;
  message: string;
  recipients: Recipient[];
};

type Props = {
  product: GiftItem;
  defaultMessage: string;
  recipients: Recipient[];
  onEditRecipients: () => void;
  onSubmit: (data: OrderFormData) => void;
  defaultSender: string;
};

const OrderForm = ({
  product,
  defaultMessage,
  recipients,
  onEditRecipients,
  onSubmit,
  defaultSender,
}: Props) => {
  const { register, handleSubmit, setValue } = useForm<OrderFormData>({
    defaultValues: {
      sender: defaultSender,
      message: defaultMessage,
      recipients,
    },
  });

  useEffect(() => {
    setValue('message', defaultMessage);
  }, [defaultMessage, setValue]);

  const total = recipients.reduce(
    (sum, r) => sum + r.quantity * product.price.sellingPrice,
    0
  );
  return (
    <form onSubmit={handleSubmit((data) => onSubmit({ ...data, recipients }))}>
      <Field>
        <Label>메시지</Label>
        <TextArea {...register('message')} rows={3} placeholder="축하해요." />
      </Field>

      <Field>
        <Label>보내는 사람</Label>
        <Input
          {...register('sender', { required: true })}
          placeholder="이름을 입력해주세요"
        />
        <Small>* 실제 선물 발송 시 발신자이름으로 반영되는 정보입니다.</Small>
      </Field>

      <RecipientSection>
        <HeaderRow>
          <SubTitle>받는 사람</SubTitle>
          <EditBtn type="button" onClick={onEditRecipients}>
            수정
          </EditBtn>
        </HeaderRow>

        {recipients.length === 0 ? (
          <PlaceholderBox>
            받는 사람이 없습니다.
            <br />
            받는 사람을 추가해주세요.
          </PlaceholderBox>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>이름</th>
                <th>전화번호</th>
                <th>수량</th>
              </tr>
            </thead>
            <tbody>
              {recipients.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.phoneNumber}</td>
                  <td>{r.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </RecipientSection>

      <ProductCard>
        <Thumb src={product.imageURL} alt="product" />
        <Info>
          <Brand>{product.brandName}</Brand>
          <ProdName>{product.name}</ProdName>
          <Price>상품가 {product?.price?.sellingPrice?.toLocaleString()}원</Price>
        </Info>
      </ProductCard>

      <SubmitButton type="submit">
        {total.toLocaleString()}원 주문하기
      </SubmitButton>
    </form>
  );
};

export default OrderForm;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.spacing2};
  margin-bottom: ${({ theme }) => theme.spacing.spacing5};
`;

const Label = styled.label`
  font: ${({ theme }) => theme.typography.subtitle2Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.spacing3};
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  border: 1px solid ${({ theme }) => theme.borderColors.default};
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.default};

  &::placeholder {
    color: ${({ theme }) => theme.textColors.placeholder};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.spacing3};
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  border: 1px solid ${({ theme }) => theme.borderColors.default};
  resize: none;
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.default};

  &::placeholder {
    color: ${({ theme }) => theme.textColors.placeholder};
  }
`;

const Small = styled.span`
  font: ${({ theme }) => theme.typography.label2Regular};
  color: ${({ theme }) => theme.textColors.sub};
`;

const RecipientSection = styled.section`
  margin: ${({ theme }) => theme.spacing.spacing8} 0
    ${({ theme }) => theme.spacing.spacing4};
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.spacing3};
`;

const SubTitle = styled.h3`
  font: ${({ theme }) => theme.typography.subtitle1Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const EditBtn = styled.button`
  background: ${({ theme }) => theme.sementicColors.kakaoYellow};
  border: none;
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  padding: ${({ theme }) => theme.spacing.spacing1}
    ${({ theme }) => theme.spacing.spacing3};
  font: ${({ theme }) => theme.typography.label2Bold};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.sementicColors.kakaoYellowHover};
  }
  &:active {
    background: ${({ theme }) => theme.sementicColors.kakaoYellowActive};
  }
`;

const PlaceholderBox = styled.div`
  padding: ${({ theme }) => theme.spacing.spacing6} 0;
  text-align: center;
  color: ${({ theme }) => theme.textColors.sub};
  font: ${({ theme }) => theme.typography.body2Regular};
  border: 1px solid ${({ theme }) => theme.borderColors.disabled};
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  background: ${({ theme }) => theme.backgroundColors.fill};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.default};

  th,
  td {
    padding: ${({ theme }) => theme.spacing.spacing3}
      ${({ theme }) => theme.spacing.spacing2};
    border-bottom: 1px solid ${({ theme }) => theme.borderColors.disabled};
    text-align: left;
  }

  th {
    background: ${({ theme }) => theme.backgroundColors.fill};
    font: ${({ theme }) => theme.typography.subtitle2Bold};
  }
`;

const ProductCard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.spacing3};
  margin: ${({ theme }) => theme.spacing.spacing8} 0
    ${({ theme }) => theme.spacing.spacing6};
  padding: ${({ theme }) => theme.spacing.spacing4};
  border: 1px solid ${({ theme }) => theme.borderColors.disabled};
  border-radius: ${({ theme }) => theme.spacing.spacing3};
  background: ${({ theme }) => theme.backgroundColors.fill};
`;

const Thumb = styled.img`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.spacing1};
  justify-content: center;
`;

const Brand = styled.span`
  font: ${({ theme }) => theme.typography.label2Regular};
  color: ${({ theme }) => theme.textColors.sub};
`;

const ProdName = styled.span`
  font: ${({ theme }) => theme.typography.body2Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const Price = styled.span`
  font: ${({ theme }) => theme.typography.body2Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const SubmitButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 720px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.spacing5} 0;
  background: ${({ theme }) => theme.sementicColors.kakaoYellow};
  color: ${({ theme }) => theme.textColors.default};
  font: ${({ theme }) => theme.typography.title2Bold};
  border: none;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.sementicColors.kakaoYellowHover};
  }
  &:active {
    background: ${({ theme }) => theme.sementicColors.kakaoYellowActive};
  }
`;
