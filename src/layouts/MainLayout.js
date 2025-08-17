import { Container, MainContent } from './MainLayout-Style';
import { TopNavigationBar } from '../Components/Home-Components/Home_Top_Navigation_Bar/TopNavigationBar';
import { Footer } from '../Components/Home-Components/Home_Footer/Footer';
import { Outlet } from 'react-router-dom';


const MainLayout = () => {

    return (
        <Container>
            <TopNavigationBar/>
            <MainContent>
                <Outlet/>
            </MainContent>
            <Footer />
        </Container>
    )
}

export default MainLayout;