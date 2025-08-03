import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useThemes } from '@/hooks/useThemes';
import Spinner from '@/components/common/Spinner';

const ThemeSection: React.FC = () => {
  const navigate = useNavigate();
  const { themes, loading, error } = useThemes();

  if (loading) return <Spinner />;
  if (error) return null;

  const currentThemes = themes || [];

  return (
    <Section>
      <Title>선물 테마</Title>
      <Grid>
        {currentThemes.map((t) => (
          <Card key={t.themeId} onClick={() => navigate(`/themes/${t.themeId}`)}>
            <Thumb src={t.image} alt={t.name} />
            <Label>{t.name}</Label>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default ThemeSection;

const Section = styled.section`
  padding: 0 16px;
  margin-top: 24px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.textColors.default};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px 16px;

  @media (max-width: 720px) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Thumb = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 6px;
`;

const Label = styled.div`
  font-size: 12px;
  text-align: center;
  color: ${({ theme }) => theme.textColors.default};
`;
