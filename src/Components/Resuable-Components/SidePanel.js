import { 
    Container, 
    ListNavigationWrapper,
    ProfileWrapper,
    ImageContainer,
    AdminProfileImage, 
    AdminProfileName,
    UserRole,
    ItemCategory, 
    List, 
    ListItem, 
    ItemsName, 
    Icons, 
    LocationLink, 
    UserProfileLink,
    CategorySection,
    BottomSection,
    LogoutButton,
    ThemeToggle,
    StatusIndicator
} from './SidePanel-Style';
// import { useAuth } from '../../context/AuthContext.js';
import defaultProfile from '../../resources/images/default_Images/defaultProfileImage.jpg';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    FiLogOut, 
    FiMoon, 
    FiUser, 
    FiUsers, 
    FiSettings, 
    FiHelpCircle 
} from 'react-icons/fi';
import { useState } from 'react';

export const SidePanel = ({ User, ListData }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(false);
    
    // Function to check if a link is active
    const isActive = (path) => {
        return location.pathname.includes(path);
    };
    
    // Handle logout function
    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logging out...");
        // navigate('/login');
    };
    
    // Handle theme toggle
    const toggleTheme = () => {
        setDarkMode(!darkMode);
        // Here you would implement actual theme switching in your app
        console.log("Toggling theme to:", !darkMode ? "dark" : "light");
    };
    
    // Get user role or default to 'User'
    const userRole = User?.role || 'Member';
    
    return (
        <Container>
            <ProfileWrapper>
                <ImageContainer>
                    <AdminProfileImage 
                        src={User?.profileImage || defaultProfile} 
                        alt={User?.Alt || 'User Profile'} 
                    />
                    <StatusIndicator title="Online" />
                </ImageContainer>
                
                <AdminProfileName>
                    {User ? User.username : 'Welcome, User'}
                </AdminProfileName>
                
                <UserRole>{userRole}</UserRole> 
                
                <UserProfileLink onClick={() => { navigate(`Profile`) }}>
                    View Profile
                </UserProfileLink> 
            </ProfileWrapper>

            <ListNavigationWrapper>
                {ListData?.map((category, categoryIndex) => (
                    <CategorySection key={`${category.category}-${categoryIndex}`}>
                        <ItemCategory>
                            {category.category}
                        </ItemCategory>
                        <List>
                            {category.items.map((item) => (
                                <LocationLink 
                                    to={item.location} 
                                    key={item.id}
                                    className={isActive(item.location) ? 'active' : ''}
                                >
                                    <ListItem>
                                        <Icons>
                                            {item.icon}
                                        </Icons>
                                        <ItemsName>
                                            {item.itemName}
                                        </ItemsName>
                                    </ListItem>
                                </LocationLink>
                            ))}
                        </List>
                    </CategorySection>
                ))}
            </ListNavigationWrapper>
            
            <BottomSection>
                <ThemeToggle onClick={toggleTheme}>
                    <FiMoon />
                    <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </ThemeToggle>
                
                <LogoutButton onClick={handleLogout}>
                    <FiLogOut />
                    <span>Log out</span>
                </LogoutButton>
            </BottomSection>
        </Container>
    );
};