import { BsFillGearFill } from 'react-icons/bs';
import { AiOutlineUser } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';

const data = JSON.parse(localStorage.getItem('userData'));
// console.log(data);
const username = data?.username;

const UserSignedDropdownData = [
  {
    id: 1,
    value: 'Profile',
    label: username ? username : 'unknown',
    icon: <AiOutlineUser />,
    location: '/User/Profile',
  },
  {
    id: 2,
    value: 'Settings',
    label: 'Settings',
    icon: <BsFillGearFill />,
    location: '/User/Settings',
  },
  {
    id: 3,
    value: 'Logout',
    label: 'Logout',
    icon: <BiLogOut />,
  },
];

export default UserSignedDropdownData;
