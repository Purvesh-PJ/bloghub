import { Outlet } from 'react-router-dom';
import { Box } from '@radix-ui/themes';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  return (
    <Box className="app-layout">
      <Header />
      <Box className="main-content">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
