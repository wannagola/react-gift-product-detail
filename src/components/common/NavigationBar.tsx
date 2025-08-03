import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiUser } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

const NavigationBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, isLoading } = useAuth();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <NavBar>
      <Left>
        <IconButton onClick={handleBack}>
          <FiChevronLeft size={24} color={theme.textColors.default} />
        </IconButton>
      </Left>

      <Center>
        <Title to="/">선물하기</Title>
      </Center>

      <Right>
        {!isLoading && (
          <IconLink to={user ? '/my' : '/login'}>
            <FiUser size={24} color={theme.textColors.default} />
          </IconLink>
        )}
      </Right>
    </NavBar>
  );
};

export default NavigationBar;

const NavBar = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.gray00};
  border-bottom: 1px solid ${({ theme }) => theme.borderColors.default};
  height: 56px;
`;

const Left = styled.div`
  position: absolute;
  left: 16px;
  display: flex;
  align-items: center;
`;

const Center = styled.div`
  font: ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.textColors.default};
`;

const Right = styled.div`
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
`;

const Title = styled(Link)`
  font: ${({ theme }) => theme.typography.title2Bold};
  color: ${({ theme }) => theme.textColors.default};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  text-decoration: none;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
`;

const IconLink = styled(Link)`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
`;
