import {
  ParentContainer,
  SettingsManagerWrapper,
} from '../../../Styles/Pages-Styles/Admin-Styles/Admin_Settings_Styles/AdminSettings.styles';
import SettingsManager from '../../../layouts/SettingsLayout';
import AdminSettingsSideNavigationData from '../../../data/AdminSettingsSideNavigationData';

const AdminSettings = () => {
  return (
    <ParentContainer>
      <SettingsManagerWrapper>
        <SettingsManager SettingsPanelData={AdminSettingsSideNavigationData} />
      </SettingsManagerWrapper>
    </ParentContainer>
  );
};

export default AdminSettings;
