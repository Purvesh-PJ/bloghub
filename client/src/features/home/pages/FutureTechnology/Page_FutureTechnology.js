import { Container } from './Page_FutureTechnology.styles';
import MultiUseButton from '@/shared/components/Button/MultiUseButton';
import MultiUseDropdown from '@/shared/components/Dropdown/MultiUseDropdown';
// import { RiAddBoxFill } from 'react-icons/ri';
import { RiShareCircleFill } from 'react-icons/ri';
import { useToggle } from '../../../../context/ToggleContext';
import { UserSignedIn as UserProfileDropdown } from '@/shared';

const Page_FutureTechnology = () => {
  const { isOpen: profileOpen, toggle: profileToggled } = useToggle('profileToggled');

  return (
    <Container>
      <MultiUseButton icon={<RiShareCircleFill />} size={'sm'} outlined={true} btnText="hello" />
      <MiltiUseDropdown
        isProfile={true}
        applyBorder={true}
        isOpen={profileOpen}
        toggle={profileToggled}
      />
      <UserProfileDropdown isOpen={profileOpen} toggle={profileToggled} />
    </Container>
  );
};

export default Page_FutureTechnology;
