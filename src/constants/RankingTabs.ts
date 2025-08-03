export const tabs = [
  { label: '많이 찜한', value: 'MANY_WISH' },
  { label: '많이 선물한', value: 'MANY_RECEIVE' },
  { label: '많이 찜하고 받은', value: 'MANY_WISH_RECEIVE' },
] as const;

export type TabValue = (typeof tabs)[number]['value'];
