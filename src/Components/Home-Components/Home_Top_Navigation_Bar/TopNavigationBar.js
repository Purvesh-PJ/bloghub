import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Navbar, 
    ChildWrapperOne, 
    ChildWrapperTwo, 
    NavLinkWrapper, 
    SearchWrapper, 
    SigninWrapper, 
    ProfileWrapper, 
    NavItem, 
    LogoWrapper, 
    LogoText,
    MobileMenuButton,
    MobileMenu,
    MobileMenuClose,
    MobileNavItem,
    MobileFooter,
    DropdownMenu,
    DropdownItem,
    NotificationBadge,
    WriteButton,
    HeaderContainer,
    ThemeToggle,
    SearchDialog
} from "./TopNaviationBar-Style";
import { useAuth } from '../../../context/AuthContext';
import { TopNavLinksData } from "../../../data/TopNavLinksData";
import MultiUseButton from "../../UI-Components/Button/MultiUseButton";
import Search from "../Home_Search/Search";
import { useToggle } from "../../../context/ToggleContext";
import Dialog from "../../UI-Components/Dialog/Dialog";
import UserSignedIn from "../../Resuable-Components/UserSignedIn";
import { 
    HiSearch, 
    HiOutlineMenu, 
    HiX, 
    HiOutlinePencil, 
    HiOutlineSun, 
    HiOutlineMoon
} from "react-icons/hi";

export const TopNavigationBar = () => {
    const { isAuthenticated, logout } = useAuth();
    const { isOpen: searchIsOpen, open: openSearch, close: closeSearch } = useToggle("searchToggle");
    const { isOpen: profileContainerIsOpen, toggle: profileToggling } = useToggle("profileToggle");
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    // Handle scroll event for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Apply dark mode
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);
    
    // Close mobile menu when location changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);
    
    // Handle theme toggle
    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };
    
    // Check if link is active
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path);
    };
    
    // Handle mobile menu toggle
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    
    // Handle write button click
    const handleWriteClick = () => {
        if (isAuthenticated) {
            navigate('/create-post');
        } else {
            navigate('/login');
        }
    };

    return (
        <HeaderContainer>
            <Navbar isScrolled={isScrolled} darkMode={darkMode}>
                <ChildWrapperOne>
                    <LogoWrapper onClick={() => navigate('/')}>
                        <LogoText darkMode={darkMode}>GeekyQuantum</LogoText>
                    </LogoWrapper>

                    <NavLinkWrapper>
                        {TopNavLinksData.map(d => (
                            <NavItem 
                                key={d.id} 
                                to={d.navItemURL}
                                active={isActive(d.navItemURL)}
                                darkMode={darkMode}
                            >
                                {d.navItemName}
                            </NavItem>
                        ))}
                    </NavLinkWrapper>
                </ChildWrapperOne>

                <ChildWrapperTwo>
                    <ThemeToggle onClick={toggleTheme} darkMode={darkMode}>
                        {darkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
                    </ThemeToggle>
                    
                    <SearchWrapper>
                        <MultiUseButton 
                            rounded={true} 
                            border={darkMode ? '1px solid #4b5563' : '1px solid #cbd5e1'} 
                            btnText='Search' 
                            icon={<HiSearch />} 
                            size='sm' 
                            iconposition='right' 
                            onClick={openSearch}
                            darkMode={darkMode}
                        />  
                        <Dialog isOpen={searchIsOpen} close={closeSearch}>
                            <Search close={closeSearch} />
                        </Dialog>
                    </SearchWrapper>
                    
                    <WriteButton onClick={handleWriteClick} darkMode={darkMode}>
                        <HiOutlinePencil />
                        <span>Write</span>
                    </WriteButton>

                    <SigninWrapper>
                        {isAuthenticated ? (
                            <ProfileWrapper>
                                <UserSignedIn 
                                    isOpen={profileContainerIsOpen} 
                                    toggle={profileToggling}
                                    darkMode={darkMode}
                                />
                                <NotificationBadge>3</NotificationBadge>
                            </ProfileWrapper>
                        ) : (
                            <MultiUseButton 
                                rounded={true} 
                                border={darkMode ? '1px solid #4b5563' : '1px solid #cbd5e1'} 
                                size='sm' 
                                btnText="Sign in" 
                                onClick={() => { navigate('/login') }}
                                fillColor={darkMode ? '#3b82f6' : '#2563eb'}
                                txtColor="white"
                                filled={true}
                                darkMode={darkMode}
                            />
                        )}
                    </SigninWrapper>
                    
                    {/* Mobile menu button */}
                    <MobileMenuButton onClick={toggleMobileMenu} darkMode={darkMode}>
                        <HiOutlineMenu />
                    </MobileMenuButton>
                </ChildWrapperTwo>
            </Navbar>
            
            {/* Mobile Menu */}
            <MobileMenu isOpen={mobileMenuOpen} darkMode={darkMode}>
                <MobileMenuClose onClick={toggleMobileMenu}>
                    <HiX />
                </MobileMenuClose>
                
                <div className="mobile-content">
                    <div className="mobile-nav-links">
                        {TopNavLinksData.map(d => (
                            <MobileNavItem 
                                key={d.id} 
                                to={d.navItemURL}
                                active={isActive(d.navItemURL)}
                                darkMode={darkMode}
                            >
                                {d.navItemName}
                            </MobileNavItem>
                        ))}
                    </div>
                    
                    <SearchDialog>
                        <MultiUseButton 
                            rounded={true} 
                            border={darkMode ? '1px solid #4b5563' : '1px solid #cbd5e1'} 
                            btnText='Search posts...' 
                            icon={<HiSearch />} 
                            size='md' 
                            iconposition='right' 
                            onClick={openSearch}
                            fullWidth={true}
                            darkMode={darkMode}
                        />
                    </SearchDialog>
                    
                    <MobileFooter>
                        {isAuthenticated ? (
                            <>
                                <MultiUseButton 
                                    rounded={true}
                                    fillColor={darkMode ? '#3b82f6' : '#2563eb'}
                                    txtColor="white"
                                    filled={true}
                                    size='md' 
                                    btnText="Write a Post" 
                                    icon={<HiOutlinePencil />}
                                    iconposition="left"
                                    onClick={() => { navigate('/create-post') }}
                                    fullWidth={true}
                                    darkMode={darkMode}
                                />
                                <MultiUseButton 
                                    rounded={true} 
                                    border={darkMode ? '1px solid #4b5563' : '1px solid #cbd5e1'} 
                                    size='md' 
                                    btnText="Logout" 
                                    onClick={logout}
                                    fullWidth={true}
                                    darkMode={darkMode}
                                />
                            </>
                        ) : (
                            <>
                                <MultiUseButton 
                                    rounded={true}
                                    fillColor={darkMode ? '#3b82f6' : '#2563eb'}
                                    txtColor="white"
                                    filled={true}
                                    size='md' 
                                    btnText="Sign up" 
                                    onClick={() => { navigate('/signup') }}
                                    fullWidth={true}
                                    darkMode={darkMode}
                                />
                                <MultiUseButton 
                                    rounded={true} 
                                    border={darkMode ? '1px solid #4b5563' : '1px solid #cbd5e1'} 
                                    size='md' 
                                    btnText="Login" 
                                    onClick={() => { navigate('/login') }}
                                    fullWidth={true}
                                    darkMode={darkMode}
                                />
                            </>
                        )}
                        
                        <div className="theme-toggle">
                            <MultiUseButton 
                                rounded={true} 
                                border={darkMode ? '1px solid #4b5563' : '1px solid #cbd5e1'} 
                                size='md' 
                                btnText={darkMode ? "Light Mode" : "Dark Mode"} 
                                icon={darkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
                                iconposition="left"
                                onClick={toggleTheme}
                                fullWidth={true}
                                darkMode={darkMode}
                            />
                        </div>
                    </MobileFooter>
                </div>
            </MobileMenu>
        </HeaderContainer>
    );
};
