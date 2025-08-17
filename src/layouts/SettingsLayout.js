import { Container, SidePanelWrapper, MainPanelWrapper } from './SettingsLayout-Style';
import SettingsSideNavigationPanel from '../Components/Resuable-Components/SettingsSideNavigationPanel';
import { Outlet } from 'react-router-dom';

const SettingsLayout = ({ SettingsPanelData }) => {

    return (
        <Container>  
            <SidePanelWrapper>
                <SettingsSideNavigationPanel SettingsPanelData={SettingsPanelData} />
            </SidePanelWrapper>
            <MainPanelWrapper>
                <Outlet/>
            </MainPanelWrapper>
        </Container>
    )
};

export default SettingsLayout;