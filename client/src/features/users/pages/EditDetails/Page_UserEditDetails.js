import { ParentContainer, UserEditDetailsFormWrapper } from './Page_UserEditDetails.styles';

// Temporary inline form (original component not found). Replace with real component when available.
const TempUserEditDetailsForm = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <h3>Edit Details</h3>
      <p>Form component is missing. This is a temporary placeholder.</p>
    </div>
  );
};

const Page_UserEditDetails = () => {
  return (
    <ParentContainer>
      <UserEditDetailsFormWrapper>
        <TempUserEditDetailsForm />
      </UserEditDetailsFormWrapper>
    </ParentContainer>
  );
};

export default Page_UserEditDetails;
