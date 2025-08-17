import { Container } from './Page_FutureTechnology-Style';
import MultiUseButton from '../../../Components/UI-Components/Button/MultiUseButton';
import MiltiUseDropdown from '../../../Components/UI-Components/Dropdown/MultiUseDropdown';
// import { RiAddBoxFill } from 'react-icons/ri';
import { RiShareCircleFill } from 'react-icons/ri';
import { useToggle } from "../../../context/ToggleContext";
import UserProfileDropdown from '../../../Components/Resuable-Components/UserSignedIn';



const Page_FutureTechnology = () => {

    const { isOpen: profileOpen, toggle: profileToggled } = useToggle("profileToggled");

    return (
        <Container>
            <MultiUseButton  icon={<RiShareCircleFill />} size={'sm'} outlined={true} btnText="hello" />
            <MiltiUseDropdown isProfile={true} applyBorder={true} isOpen={profileOpen} toggle={profileToggled } />
            <UserProfileDropdown isOpen={profileOpen} toggle={profileToggled } />
        </Container>
    )
}

export default Page_FutureTechnology;



 