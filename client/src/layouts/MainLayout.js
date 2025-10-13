import { Container, MainContent } from './MainLayout.styles';
import { TopNavigationBar } from '../features/home/components/TopNavigationBar/TopNavigationBar';
import { Footer } from '../features/home/components/Footer/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <Container>
      <TopNavigationBar />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </Container>
  );
};

export default MainLayout;
