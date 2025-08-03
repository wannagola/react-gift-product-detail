import styled from '@emotion/styled';
import { useForm, useFieldArray } from 'react-hook-form';
import { Recipient } from '@/types/order';
import { PHONE_REGEX } from '@/constants/regex';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipients: Recipient[]) => void;
  initialRecipients: Recipient[];
}

type FormValues = {
  recipients: Recipient[];
};

const RecipientsModal = ({
  isOpen,
  onClose,
  onSave,
  initialRecipients,
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      recipients:
        initialRecipients.length > 0
          ? initialRecipients
          : [{ name: '', phoneNumber: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'recipients',
  });

  const onSubmit = (data: FormValues) => {
    const phones = data.recipients.map((r) => r.phoneNumber.trim());
    if (new Set(phones).size !== phones.length) {
      alert('전화번호가 중복되지 않도록 입력해주세요.');
      return;
    }

    // quantity 값을 숫자로 명시적으로 변환하고, 유효하지 않으면 1로 설정
    const cleanedRecipients = data.recipients.map((r) => ({
      ...r,
      quantity: typeof r.quantity === 'number' && !isNaN(r.quantity) ? r.quantity : 1,
    }));

    onSave(cleanedRecipients); // 수정된 recipients 배열 전달
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <Modal>
        <Title>받는 사람</Title>
        <Notice>
          * 최대 10명까지 추가할 수 있어요.
          <br />* 전화번호는 중복 입력할 수 없어요.
        </Notice>

        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, idx) => {
            const nameErr = errors.recipients?.[idx]?.name?.message as
              | string
              | undefined;
            const phoneErr = errors.recipients?.[idx]?.phoneNumber?.message as
              | string
              | undefined;
            const qtyErr = errors.recipients?.[idx]?.quantity?.message as
              | string
              | undefined;

            return (
              <Row key={field.id}>
                <InputBox>
                  <Input
                    {...register(`recipients.${idx}.name`, {
                      required: '이름을 입력하세요.',
                    })}
                    placeholder="이름"
                  />
                  {nameErr && <ErrorMsg>{nameErr}</ErrorMsg>}
                </InputBox>

                <InputBox>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    {...register(`recipients.${idx}.phoneNumber`, {
                      required: '전화번호를 입력하세요.',
                      pattern: {
                        value: PHONE_REGEX,
                        message: '010으로 시작하는 11자리 숫자만 가능해요.',
                      },
                    })}
                    placeholder="전화번호 (예: 01012345678)"
                  />
                  {phoneErr && <ErrorMsg>{phoneErr}</ErrorMsg>}
                </InputBox>

                <InputBox narrow>
                  <Input
                    type="number"
                    min={1}
                    {...register(`recipients.${idx}.quantity`, {
                      valueAsNumber: true,
                      required: '수량을 입력하세요.',
                      min: { value: 1, message: '1개 이상이어야 해요.' },
                    })}
                    placeholder="1"
                  />
                  {qtyErr && <ErrorMsg>{qtyErr}</ErrorMsg>}
                </InputBox>

                <DeleteButton type="button" onClick={() => remove(idx)}>
                  삭제
                </DeleteButton>
              </Row>
            );
          })}

          {fields.length < 10 && (
            <AddButton
              type="button"
              onClick={() => append({ name: '', phoneNumber: '', quantity: 1 })}
            >
              + 추가하기
            </AddButton>
          )}

          <ActionRow>
            <Cancel type="button" onClick={onClose}>
              취소
            </Cancel>
            <Confirm type="submit">{fields.length}명 완료</Confirm>
          </ActionRow>
        </form>
      </Modal>
    </Overlay>
  );
};

export default RecipientsModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  overflow-y: auto;
  display: flex;
  justify-content: center;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.backgroundColors.default};
  padding: ${({ theme }) => theme.spacing.spacing6};
  border-radius: ${({ theme }) => theme.spacing.spacing4};
  width: 100%;
  max-width: 720px;
  margin: ${({ theme }) => theme.spacing.spacing8}
    ${({ theme }) => theme.spacing.spacing4};
`;

const Title = styled.h3`
  font: ${({ theme }) => theme.typography.title2Bold};
  margin-bottom: ${({ theme }) => theme.spacing.spacing2};
  color: ${({ theme }) => theme.textColors.default};
`;

const Notice = styled.p`
  font: ${({ theme }) => theme.typography.label1Regular};
  color: ${({ theme }) => theme.textColors.sub};
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
  line-height: 1.4;
`;

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.spacing2};
  margin-bottom: ${({ theme }) => theme.spacing.spacing3};
  align-items: flex-start;
`;

const InputBox = styled.div<{ narrow?: boolean }>`
  flex: ${({ narrow }) => (narrow ? '0 0 64px' : '1')};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.spacing1};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.spacing2};
  border: 1px solid ${({ theme }) => theme.borderColors.default};
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.default};

  &::placeholder {
    color: ${({ theme }) => theme.textColors.placeholder};
  }

  &:disabled {
    background: ${({ theme }) => theme.backgroundColors.disabled};
    color: ${({ theme }) => theme.textColors.disabled};
  }
`;

const ErrorMsg = styled.span`
  color: ${({ theme }) => theme.stateColors.critical};
  font: ${({ theme }) => theme.typography.label2Regular};
`;

const DeleteButton = styled.button`
  background: ${({ theme }) => theme.stateColors.critical};
  color: ${(props) => props.theme.colors.gray00};
  border: none;
  padding: ${({ theme }) => theme.spacing.spacing2}
    ${({ theme }) => theme.spacing.spacing3};
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  cursor: pointer;
  font: ${({ theme }) => theme.typography.label2Bold};
  flex: 0 0 auto;
  height: 36px;
  align-self: center;
`;

const AddButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.spacing2};
  padding: ${({ theme }) => theme.spacing.spacing2}
    ${({ theme }) => theme.spacing.spacing3};
  background: ${({ theme }) => theme.sementicColors.kakaoYellow};
  border: none;
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  font: ${({ theme }) => theme.typography.body2Bold};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.sementicColors.kakaoYellowHover};
  }

  &:active {
    background: ${({ theme }) => theme.sementicColors.kakaoYellowActive};
  }
`;

const ActionRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.spacing6};
  display: flex;
  gap: ${({ theme }) => theme.spacing.spacing2};
`;

const Cancel = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.spacing3} 0;
  background: ${({ theme }) => theme.backgroundColors.disabled};
  border: none;
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  font: ${({ theme }) => theme.typography.body2Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const Confirm = styled.button`
  flex: 2;
  padding: ${({ theme }) => theme.spacing.spacing3} 0;
  background: ${({ theme }) => theme.sementicColors.kakaoYellow};
  color: ${({ theme }) => theme.textColors.default};
  border: none;
  border-radius: ${({ theme }) => theme.spacing.spacing2};
  font: ${({ theme }) => theme.typography.body2Bold};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.sementicColors.kakaoYellowHover};
  }

  &:active {
    background: ${({ theme }) => theme.sementicColors.kakaoYellowActive};
  }
`;
