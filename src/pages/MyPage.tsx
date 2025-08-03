import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const MyPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <Title>마이페이지</Title>
      <Text>{user?.email}님, 환영합니다 🎉</Text>
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
    </Container>
  );
};

export default MyPage;

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.spacing10};
  text-align: center;
`;

const Title = styled.h2`
  font: ${({ theme }) => theme.typography.title1Bold};
  color: ${({ theme }) => theme.textColors.default};
  margin-bottom: ${({ theme }) => theme.spacing.spacing6};
`;

const Text = styled.p`
  font: ${({ theme }) => theme.typography.body2Regular};
  color: ${({ theme }) => theme.textColors.sub};
  margin-bottom: ${({ theme }) => theme.spacing.spacing10};
`;

const LogoutButton = styled.button`
  padding: ${({ theme }) => theme.spacing.spacing3};
  font: ${({ theme }) => theme.typography.body2Bold};
  background-color: ${({ theme }) => theme.colors.gray300};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColors.default};
`;
