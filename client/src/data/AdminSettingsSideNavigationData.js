// import { BiSolidUser} from 'react-icons/bi';
import { MdPrivacyTip } from 'react-icons/md';
import { IoLanguage } from 'react-icons/io5';
import { VscFeedback } from 'react-icons/vsc';
import { BiPaperPlane } from 'react-icons/bi';
import { FaUserShield } from 'react-icons/fa';

const AdminSettingsSideNavigationData = [
  // {
  //     id : 1,
  //     icon : <BiSolidUser /> ,
  //     itemName : 'Profile Information',
  //     location : 'ProfileInformation'
  // },

  {
    id: 1,
    icon: <BiPaperPlane />,
    itemName: 'Notification Settings',
    location: 'NotificationSettings',
  },

  {
    id: 2,
    icon: <IoLanguage />,
    itemName: 'Language Setting',
    location: 'LanguageSettings',
  },

  {
    id: 3,
    icon: <FaUserShield />,
    itemName: 'Account Security',
    location: 'AccountSecurity',
  },

  {
    id: 4,
    icon: <MdPrivacyTip />,
    itemName: 'Privacy and Legal',
    location: 'PrivacyAndLegal',
  },

  {
    id: 5,
    icon: <VscFeedback />,
    itemName: 'Feedback and Support',
    location: 'FeedbackAndSupport',
  },
];

export default AdminSettingsSideNavigationData;
