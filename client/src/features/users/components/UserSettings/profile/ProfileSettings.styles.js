import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  // padding : 1.8rem;
  gap: 10px;
  //border : 1px solid gray;
`;

export const Heading = styled.h2`
  font-size: 16px;
  color: #475569;
  margin: 0;
`;

export const Divider = styled.hr`
  background-color: #f1f5f9;
  color: #f1f5f9;
`;

// Card-based settings UI styled components
export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  // max-width: 1000px;
  margin: 0 auto;
`;

export const SettingsHeader = styled.div`
  //   padding: 1rem 0;
`;

export const SettingsTitle = styled.h1`
  font-size: 0.75rem;
  font-weight: 600;
  color: #405477;
  margin: 0;
  padding: 1rem;
`;

export const SettingsTabs = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Tab = styled.div`
  display: flex;
  align-items: center;
  //justify-content : center;
  // border : 1px solid #e5e7eb;
  padding: 0.75rem 1.25rem;
  font-size: 0.75rem;
  // font-weight: ${(props) => (props.active ? '600' : '500')};
  font-weight: 500;
  color: ${(props) => (props.active ? 'oklch(27.8% 0.033 256.848)' : 'oklch(55.1% 0.027 264.364)')};
  border-bottom: 2px solid
    ${(props) => (props.active ? 'oklch(27.8% 0.033 256.848)' : 'transparent')};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) =>
      props.active ? 'oklch(27.8% 0.033 256.848)' : 'oklch(37.3% 0.034 259.733)'};
  }

  @media (max-width: 640px) {
    padding: 0.75rem 1rem;
  }
`;

export const TabIcon = styled.span`
  display: flex;
  margin-right: 0.5rem;
  font-size: 0.75rem;
  color: oklch(27.8% 0.033 256.848);
  // border: 1px solid #e5e7eb;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;

export const ContentArea = styled.div`
  position: relative;
  padding: 1rem;
`;

export const SettingsGrid = styled.div`
  // display: grid;
  // grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  // gap: 1rem;
  // margin-bottom: 2rem;

  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  width: 100%;
`;

export const SettingCard = styled.div`
  background: white;
  border-radius: 4px 4px 0 0;
  // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
  // border-top : 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  padding: 0 1rem 0 1rem;

  &:hover {
    transform: translateY(-1px);
    // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    background-color: oklch(98.5% 0.002 247.839);
  }
`;

export const CardHeader = styled.div`
  padding: 0.2rem 0.2rem 0.2rem 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // border-bottom: 1px solid #f3f4f6;
  // background-color: #f9fafb;
  // border : 1px solid #f3f4f6;
`;

export const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: oklch(27.8% 0.033 256.848);
`;

export const CardIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.4rem;
  height: 1.4rem;
  // background-color: ${(props) => props.bgColor || '#eff6ff'};
  // color: ${(props) => props.color || '#4f46e5'};
  border-radius: 20px;
  margin-right: 0.75rem;
`;

export const CardContent = styled.div`
  padding: 0.2rem 0.2rem 0.5rem 2.4rem;
  // border : 1px solid #f3f4f6;
`;

export const CardDescription = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 400;
  color: oklch(44.6% 0.03 256.802);
  line-height: 1.2;
`;

export const ArrowIcon = styled.span`
  color: #9ca3af;
`;

export const ActiveSettingContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
`;

export const SettingBackButton = styled.button`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  font-weight: 500;

  &:hover {
    color: #111827;
  }

  svg {
    margin-right: 0.5rem;
    transform: rotate(180deg);
  }
`;

// Alternative sidebar layout styled components
export const SettingsSidebar = styled.div`
  width: 240px;
  background-color: #f9fafb;
  border-right: 1px solid #eef1f6;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eef1f6;
  }
`;

export const SettingsLayout = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SettingsNav = styled.nav`
  padding: 1rem 0;
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: ${(props) => (props.active ? '#4f46e5' : '#4b5563')};
  font-weight: ${(props) => (props.active ? '600' : '400')};
  background-color: ${(props) => (props.active ? '#eff6ff' : 'transparent')};
  border-left: 3px solid ${(props) => (props.active ? '#4f46e5' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#eff6ff' : '#f3f4f6')};
    color: ${(props) => (props.active ? '#4f46e5' : '#111827')};
  }
`;

export const NavIcon = styled.span`
  margin-right: 0.75rem;
  font-size: 0.75rem;
  opacity: ${(props) => (props.active ? '1' : '0.8')};
`;

export const NavText = styled.span`
  font-size: 0.75rem;
`;

export const SettingsContent = styled.div`
  flex: 1;
  padding: 1rem;
`;

export const SettingsSection = styled.div`
  display: ${(props) => (props.active ? 'block' : 'none')};
`;
