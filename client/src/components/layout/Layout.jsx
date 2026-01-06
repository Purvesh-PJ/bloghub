import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  transition: background-color ${({ theme }) => theme.transitions.normal};
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.layout.headerHeight};
`;

export function Layout() {
  return (
    <AppLayout>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </AppLayout>
  );
}
