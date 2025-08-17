import { Form, FormHeading, Divider } from "./AccountPrivacy-Style";
import Dropdown from "../../../UI-Components/Dropdown/Dropdown";

const AccountPrivacy = () => {

    const handleDropdownChange = (e) => {
        alert('Selected value:', e);
    };

    const options = [
        { label: 'Public', value: 'Public'},
        { label: 'Private', value: 'Private'},
        { label: 'Followers Only', value: 'Followers Only'},
    ];

    return (
        <Form>
            <FormHeading>
                Account privacy
            </FormHeading>

            <Divider/>

            <Dropdown
                options={options}
                onChange={handleDropdownChange}
                defaultValue="public"
                className="custom-dropdown"
            />
        </Form>
    )
};

export default AccountPrivacy;  