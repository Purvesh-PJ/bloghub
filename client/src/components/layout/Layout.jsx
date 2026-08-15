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

/*
  No padding-top on the main region. The header is position:sticky, so it still occupies
  its own row in the flow — offsetting for its height a second time left a dead 64px band
  under the bar on every page. The padding was a leftover from when the header was fixed.
*/
const MainContent = styled.main`
  flex: 1;
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
