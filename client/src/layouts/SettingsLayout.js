import { Container, SidePanelWrapper, MainPanelWrapper } from './SettingsLayout.styles';
import { SettingsSideNavigationPanel } from '@/shared';
import { Outlet } from 'react-router-dom';

const SettingsLayout = ({ SettingsPanelData }) => {
  return (
    <Container>
      <SidePanelWrapper>
        <SettingsSideNavigationPanel SettingsPanelData={SettingsPanelData} />
      </SidePanelWrapper>
      <MainPanelWrapper>
        <Outlet />
      </MainPanelWrapper>
    </Container>
  );
};

export default SettingsLayout;
