import { Routes, Route } from 'react-router-dom';

// LAYOUTS
import MainLayout from './layouts/MainLayout';
import OwnerLayout from './layouts/OwnerLayout';
import SettingsLayout from './layouts/SettingsLayout';

// PAGES
import PageHome from './features/home/pages/Main/Page_Home';
import PageFutureTechnology from './features/home/pages/FutureTechnology/Page_FutureTechnology';
import PageTechnologyNews from './features/home/pages/TechnologyNews/Page_TechnologyNews';
import PageSinglePost from './features/home/pages/FullPost/Page_SinglePost';
import PageAdminDashboard from './features/dashboard/pages/Dashboard/Page_AdminDashboard';
import PageAdminAddposts from './features/dashboard/pages/AddPosts/Page_AdminAddPosts';
import PageAdminDataManagement from './features/dashboard/pages/ManageData/Page_AdminDataManagement';
import PageAdminManageUsers from './features/dashboard/pages/ManageUsers/Page_AdminManageUsers';
import PageEditBlogPost from './features/dashboard/pages/ManageData/Page_EditBlogPost';
import PageCreatePost from './features/users/pages/AddPost/Page_AddPost';
import PageUsersDataManagement from './features/users/pages/ManageData/Page_UsersDataManagement';
import PageUserAnalytics from './features/users/pages/Analytics/Page_UserAnalytics';
import PageUserProfile from './features/users/pages/Profile/Page_User_Profile';
import PageAdminCategories from './features/dashboard/pages/Categories/Page_AdminCategories';
import PageAdminUserActivity from './features/dashboard/pages/UserActivity/Page_AdminUserActivity';
import PageAdminReports from './features/dashboard/pages/Reports/Page_AdminReports';
import PageAdminModerationLog from './features/dashboard/pages/ModerationLog/Page_AdminModerationLog';

// COMPONENTS
import UserLogin from './features/auth/pages/UserLogin';
import UserRegister from './features/auth/pages/UserRegister';
import Profile from './features/users/components/UserProfile/Profile';
import UpdateProfile from './features/users/components/UserSettings/profile/UpdateProfile';
import ManageContent from './features/users/components/ManageContent/ManageContent';
import DisplayPost from './features/users/components/DisplayPost/DisplayPost';
import UserProfileSection from './features/users/components/UserProfile/UserProfile';
import ProfileSettings from './features/users/components/UserSettings/profile/ProfileSettings';
import SecuritySettings from './features/users/components/UserSettings/security/SecuritySettings';
import PrivacySettings from './features/users/components/UserSettings/privacy/PrivacySettings';
import AppearanceSettings from './features/users/components/UserSettings/appearance/AppearanceSettings';
import AccountManagement from './features/users/components/UserSettings/account/AccountManagement';

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

          <Route path="Profile" element={<PageUserProfile />}>
            <Route element={<Profile />} />
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

          <Route
            path="Settings/*"
            element={<SettingsLayout SettingsPanelData={AdminSettingsSideNavigationData} />}
          >
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

          <Route path="Profile" element={<PageUserProfile />}>
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

          <Route
            path="Settings/*"
            element={<SettingsLayout SettingsPanelData={UserSettingsSideNavigationData} />}
          >
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
