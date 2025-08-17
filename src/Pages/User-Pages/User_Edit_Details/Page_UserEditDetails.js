import { ParentContainer, UserEditDetailsFormWrapper } from './Page_UserEditDetails-Style';
import UserEditDetailsForm from '../../../Components/User-Components/User_Edit_Details/UserEditDetailsForm';

const Page_UserEditDetails = () => {
    
    return (
        <ParentContainer>
            <UserEditDetailsFormWrapper>
                <UserEditDetailsForm />
            </UserEditDetailsFormWrapper>
        </ParentContainer>
    )
};

export default Page_UserEditDetails;