import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';
import { SkipLink } from './SkipLink';

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
      <SkipLink />
      <Header />
      {/* tabIndex={-1} so the skip link can move focus here, not just scroll to it. */}
      <MainContent id="main-content" tabIndex={-1}>
        <Outlet />
      </MainContent>
      <Footer />
    </AppLayout>
  );
}
