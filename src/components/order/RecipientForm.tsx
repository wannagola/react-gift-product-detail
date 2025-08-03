import styled from '@emotion/styled';
import { Recipient } from '@/types/order';

type Props = {
  index: number;
  recipient: Recipient;
  onChange: (index: number, updated: Recipient) => void;
  onRemove: (index: number) => void;
};

const RecipientForm = ({ index, recipient, onChange, onRemove }: Props) => {
  const handleChange = (field: keyof Recipient, value: string | number) => {
    onChange(index, { ...recipient, [field]: value });
  };

  return (
    <Row>
      <input
        placeholder="이름"
        value={recipient.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <input
        placeholder="전화번호 (010으로 시작)"
        value={recipient.phoneNumber}
        onChange={(e) => handleChange('phoneNumber', e.target.value)}
      />
      <input
        type="number"
        min={1}
        value={recipient.quantity}
        onChange={(e) => handleChange('quantity', Number(e.target.value))}
      />
      <DeleteBtn onClick={() => onRemove(index)}>삭제</DeleteBtn>
    </Row>
  );
};

export default RecipientForm;

const Row = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;

  input {
    flex: 1;
    padding: 8px;
  }
`;

const DeleteBtn = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
`;
