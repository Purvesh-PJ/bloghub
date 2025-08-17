import { Routes, Route } from 'react-router-dom';

// LAYOUTS
import MainLayout from './layouts/MainLayout';
import OwnerLayout from './layouts/OwnerLayout';
import SettingsLayout from './layouts/SettingsLayout';

// PAGES 
import PageHome from './Pages/Home-Pages/Home_Main/Page_Home';
import PageFutureTechnology from './Pages/Home-Pages/Home_Future_Technology/Page_FutureTechnology';
import PageTechnologyNews from './Pages/Home-Pages/Home_Technology_News/Page_TechnologyNews';
import PageSinglePost from './Pages/Home-Pages/Home_Full_Post/Page_SinglePost';
import PageAdminDashboard from './Pages/Admin-Pages/Admin_Dashboard/Page_AdminDashboard';
import PageAdminAddposts from './Pages/Admin-Pages/Admin_Add_Posts/Page_AdminAddPosts';
import PageAdminDataManagement from './Pages/Admin-Pages/Admin_Manage_Data/Page_AdminDataManagement';
import PageAdminManageUsers from './Pages/Admin-Pages/Admin_Manage_Users/Page_AdminManageUsers';
import PageEditBlogPost from './Pages/Admin-Pages/Admin_Manage_Data/Page_EditBlogPost';
import PageCreatePost from './Pages/User-Pages/User_Add_Post/Page_AddPost';
import PageUsersDataManagement from './Pages/User-Pages/User_Manage_Data/Page_UsersDataManagement';
import PageUserAnalytics from './Pages/User-Pages/User_Analytics/Page_UserAnalytics';
import PageUserProfile from './Pages/User-Pages/User_Profile/Page_User_Profile';
import PageAdminCategories from './Pages/Admin-Pages/Admin_Categories/Page_AdminCategories';
import PageAdminUserActivity from './Pages/Admin-Pages/Admin_User_Activity/Page_AdminUserActivity';
import PageAdminReports from './Pages/Admin-Pages/Admin_Reports/Page_AdminReports';
import PageAdminModerationLog from './Pages/Admin-Pages/Admin_Moderation_Log/Page_AdminModerationLog';

// COMPONENTS 
import UserLogin from './Components/User-Auth-Components/UserLogin';
import UserRegister from './Components/User-Auth-Components/UserRegister';
import Profile from './Components/User-Components/User_Profile/Profile';
import UpdateProfile from './Components/User-Components/User_Settings/profile/UpdateProfile';
import ManageContent from './Components/User-Components/Manage_content/ManageContent';
import DisplayPost from './Components/User-Components/Display_Post/DisplayPost';
import UserProfileSection from './Components/User-Components/User_Profile/UserProfile';
import ProfileSettings from './Components/User-Components/User_Settings/profile/ProfileSettings';
import SecuritySettings from './Components/User-Components/User_Settings/security/SecuritySettings';
import PrivacySettings from './Components/User-Components/User_Settings/privacy/PrivacySettings';
import AppearanceSettings from './Components/User-Components/User_Settings/appearance/AppearanceSettings';
import AccountManagement from './Components/User-Components/User_Settings/account/AccountManagement';

// DATA     
import AdminSettingsSideNavigationData from './data/AdminSettingsSideNavigationData';
import UserSettingsSideNavigationData from './data/UsersSettingsSideNavigationData';
import { UserSidePanelData } from './data/UserSidePanelData';
import { AdminSidePanelData } from './data/AdminSidePanelData';
import { NavigationHistoryProvider } from './context/NavigationHistoryContext';


export const Routing = () => {

    const user = JSON.parse(localStorage.getItem('userData'));

    return (
        <NavigationHistoryProvider>
            <Routes>
                {/* Home Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<PageHome />} />
                    <Route path="Home" element={<PageHome />} />
                    <Route path="FutureTechnology" element={<PageFutureTechnology />} />
                    <Route path="TechnologyNews" element={<PageTechnologyNews />} />
                    <Route path="FullPost/:_id" element={<PageSinglePost />} />
                </Route>
                
                {/* Admin Routes */}
                <Route path="/Admin" element={<OwnerLayout User={user} ListData={AdminSidePanelData} />}>

                    <Route index element={<PageAdminDashboard />} />

                    <Route path="Profile" element={<PageUserProfile />} >
                        <Route element={<Profile/>} />
                        <Route path="EditProfile" element={<UpdateProfile />} />
                    </Route>

                    <Route path="Dashboard" element={<PageAdminDashboard />} />
                    <Route path="AddBlogPost" element={<PageAdminAddposts />} />
                    
                    <Route path="ManageData" element={<PageAdminDataManagement />}>
                        <Route index element={<ManageContent />} />
                        <Route path="EditBlogPost/:_id" element={<PageEditBlogPost />} />
                        <Route path="ViewPost/:_id" element={<DisplayPost />} />
                    </Route>
                    
                    <Route path="ManageUsers" element={<PageAdminManageUsers />} />
                    <Route path="UserActivity" element={<PageAdminUserActivity />} />
                    <Route path="Categories" element={<PageAdminCategories />} />
                    <Route path="Reports" element={<PageAdminReports />} />
                    <Route path="ModerationLog" element={<PageAdminModerationLog />} />
                    <Route path="ManageData/EditBlogPost/:_id" element={<PageEditBlogPost />} />

                    <Route path="Settings/*" element={<SettingsLayout SettingsPanelData={AdminSettingsSideNavigationData} />}>
                        {/* <Route path="profileSettings" element={<ProfileSettings />} />
                        <Route path="appearence" element={<AppearanceSettings />} />
                        <Route path="securitySettings" element={<SecuritySettings />} />
                        <Route path="privacySettings" element={<PrivacySettings />} />
                        <Route path="manageAccount" element={<AccountManagement />} /> */}
                    </Route>

                </Route>

                {/* User Routes */}
                <Route path="/User" element={<OwnerLayout User={user} ListData={UserSidePanelData} />}>

                    <Route index element={<PageUserAnalytics />} />

                    <Route path="Profile" element={<PageUserProfile />} >
                        <Route index element={<UserProfileSection />} />
                        {/* <Route path="EditProfile" element={<UpdateProfile />} /> */}
                    </Route>
        
                    <Route path="Analytics" element={<PageUserAnalytics />} />
                    <Route path="CreatePost" element={<PageCreatePost />} />

                    <Route path="ManageContent" element={<PageUsersDataManagement />}>
                        <Route index element={<ManageContent />} />
                        <Route path="EditBlogPost/:_id" element={<PageEditBlogPost />} />
                        <Route path="ViewPost/:_id" element={<DisplayPost />} />
                    </Route>

                    <Route path="Settings/*" element={<SettingsLayout SettingsPanelData={UserSettingsSideNavigationData} />}>
                        <Route path="profileSettings" element={<ProfileSettings />} />
                        <Route path="appearence" element={<AppearanceSettings />} />
                        <Route path="securitySettings" element={<SecuritySettings />} />
                        <Route path="privacySettings" element={<PrivacySettings />} />
                        <Route path="manageAccount" element={<AccountManagement />} />
                    </Route>
                </Route>

                {/* Authentication Routes */}
                <Route path="/login" element={<UserLogin />} />
                <Route path="/signup" element={<UserRegister />} />
            </Routes>
        </NavigationHistoryProvider>
    );
};
