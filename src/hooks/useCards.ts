import { useEffect, useState } from 'react';
import { messageCards } from '@/mock/cards';

export const useCards = () => {
  const [cards, setCards] = useState(messageCards);
  const [loading, setLoading] = useState(true);
  const [error] = useState<Error | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCards(messageCards);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return { cards, loading, error };
};
