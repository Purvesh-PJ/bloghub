import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  NavbarContainer, 
  NavbarContent,
  LogoContainer, 
  Logo, 
  LogoText,
  SearchWrapper,
  SearchContainer,
  SearchInput,
  SearchButton,
  SearchResults,
  SearchResultItem,
  SearchEmptyState,
  NavLinksContainer,
  NavLinkItem,
  NavLinkText,
  DropdownArrow,
  DropdownMenu,
  DropdownItem,
  AuthContainer,
  AuthButton,
  UserPanel,
  UserAvatar,
  NotificationBadge,
  MobileMenuToggle,
  MobileMenu,
  MobileNavHeader,
  MobileNavLinks,
  MobileNavLink,
  MobileFooter,
  MobileSearchContainer,
  CloseButton,
  DarkModeToggle,
  ThemeIcon,
  WriteBtnDesktop,
  WriteBtnMobile,
  BottomNavigation,
  BottomNavItem
} from './TopNavigationBar-Style';
import { useAuth } from '../../context/AuthContext';
import defaultAvatar from '../../resources/images/default_Images/defaultProfileImage.jpg';
import { 
  FaSearch, 
  FaBars, 
  FaTimes, 
  FaFeatherAlt, 
  FaUser, 
  FaSignOutAlt, 
  FaBell, 
  FaBookmark, 
  FaSun, 
  FaMoon,
  FaHome,
  FaCompass,
  FaBook,
  FaEnvelope,
  FaCog,
  FaChevronDown
} from 'react-icons/fa';

const TopNavigationBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const categories = [
    { name: 'Technology', path: '/categories/technology' },
    { name: 'Travel', path: '/categories/travel' },
    { name: 'Lifestyle', path: '/categories/lifestyle' },
    { name: 'Food', path: '/categories/food' },
    { name: 'Business', path: '/categories/business' },
    { name: 'Health', path: '/categories/health' }
  ];
  
  useEffect(() => {
    // Handle scroll events for navbar styling
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Handle document clicks to close dropdowns
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-toggle') && !e.target.closest('.dropdown-menu')) {
        setOpenDropdown(null);
      }
      
      if (!e.target.closest('.search-container') && !e.target.closest('.search-results')) {
        setShowSearchResults(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setShowSearchResults(false);
      setIsMobileMenuOpen(false);
    }
  };
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length > 1) {
      // Mock search - in a real app you'd call your API here
      setSearchResults([
        { id: 1, title: "How to Build a React App", category: "Technology" },
        { id: 2, title: "10 Places to Visit in Europe", category: "Travel" },
        { id: 3, title: "Modern JavaScript Features", category: "Technology" }
      ].filter(result => 
        result.title.toLowerCase().includes(value.toLowerCase()) ||
        result.category.toLowerCase().includes(value.toLowerCase())
      ));
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  return (
    <>
      <NavbarContainer scrolled={isScrolled} darkMode={darkMode}>
        <NavbarContent>
          {/* Logo */}
          <LogoContainer>
            <Link to="/">
              <Logo>
                <FaFeatherAlt />
                <LogoText>Wordsmith</LogoText>
              </Logo>
            </Link>
          </LogoContainer>
          
          {/* Main Navigation Links */}
          <NavLinksContainer>
            <NavLinkItem active={isActive('/')}>
              <Link to="/">
                <NavLinkText>Home</NavLinkText>
              </Link>
            </NavLinkItem>
            
            <NavLinkItem active={isActive('/explore')}>
              <Link to="/explore">
                <NavLinkText>Explore</NavLinkText>
              </Link>
            </NavLinkItem>
            
            <NavLinkItem 
              active={isActive('/categories')}
              className="dropdown-toggle"
              onClick={() => toggleDropdown('categories')}
            >
              <NavLinkText>Categories</NavLinkText>
              <DropdownArrow open={openDropdown === 'categories'} />
              
              {openDropdown === 'categories' && (
                <DropdownMenu className="dropdown-menu">
                  {categories.map((category, index) => (
                    <DropdownItem key={index}>
                      <Link to={category.path}>{category.name}</Link>
                    </DropdownItem>
                  ))}
                  <DropdownItem>
                    <Link to="/categories">All Categories</Link>
                  </DropdownItem>
                </DropdownMenu>
              )}
            </NavLinkItem>
            
            <NavLinkItem active={isActive('/about')}>
              <Link to="/about">
                <NavLinkText>About</NavLinkText>
              </Link>
            </NavLinkItem>
            
            <NavLinkItem active={isActive('/contact')}>
              <Link to="/contact">
                <NavLinkText>Contact</NavLinkText>
              </Link>
            </NavLinkItem>
          </NavLinksContainer>
          
          {/* Search Section */}
          <SearchWrapper>
            <SearchContainer className="search-container">
              <SearchInput
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm.trim().length > 1 && setShowSearchResults(true)}
              />
              <SearchButton onClick={handleSearch}>
                <FaSearch />
              </SearchButton>
              
              {showSearchResults && (
                <SearchResults className="search-results">
                  {searchResults.length > 0 ? (
                    searchResults.map(result => (
                      <SearchResultItem key={result.id} onClick={() => {
                        navigate(`/post/${result.id}`);
                        setShowSearchResults(false);
                        setSearchTerm('');
                      }}>
                        <span className="title">{result.title}</span>
                        <span className="category">{result.category}</span>
                      </SearchResultItem>
                    ))
                  ) : (
                    <SearchEmptyState>
                      No results found for "{searchTerm}"
                    </SearchEmptyState>
                  )}
                </SearchResults>
              )}
            </SearchContainer>
          </SearchWrapper>
          
          {/* Auth Section / User Panel */}
          <AuthContainer>
            {isAuthenticated ? (
              <>
                <WriteBtnDesktop onClick={() => navigate('/create-post')}>
                  <FaFeatherAlt />
                  <span>Write</span>
                </WriteBtnDesktop>
                
                <DarkModeToggle onClick={() => setDarkMode(!darkMode)}>
                  <ThemeIcon>{darkMode ? <FaSun /> : <FaMoon />}</ThemeIcon>
                </DarkModeToggle>
                
                <div className="dropdown-toggle" onClick={() => toggleDropdown('user')}>
                  <UserPanel>
                    <NotificationBadge count={3} />
                    <UserAvatar src={user?.profileImage || defaultAvatar} alt="User Avatar" />
                  </UserPanel>
                  
                  {openDropdown === 'user' && (
                    <DropdownMenu className="dropdown-menu" right>
                      <DropdownItem highlight>
                        <div className="user-info">
                          <span className="name">{user?.username || 'User'}</span>
                          <span className="email">{user?.email || 'user@example.com'}</span>
                        </div>
                      </DropdownItem>
                      <DropdownItem>
                        <Link to="/dashboard">
                          <FaUser />
                          Dashboard
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link to="/bookmarks">
                          <FaBookmark />
                          Bookmarks
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link to="/notifications">
                          <FaBell />
                          Notifications
                          <span className="badge">3</span>
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link to="/settings">
                          <FaCog />
                          Settings
                        </Link>
                      </DropdownItem>
                      <DropdownItem onClick={handleLogout}>
                        <FaSignOutAlt />
                        Logout
                      </DropdownItem>
                    </DropdownMenu>
                  )}
                </div>
              </>
            ) : (
              <>
                <DarkModeToggle onClick={() => setDarkMode(!darkMode)}>
                  <ThemeIcon>{darkMode ? <FaSun /> : <FaMoon />}</ThemeIcon>
                </DarkModeToggle>
                
                <AuthButton secondary onClick={() => navigate('/login')}>
                  Login
                </AuthButton>
                
                <AuthButton primary onClick={() => navigate('/signup')}>
                  Sign Up
                </AuthButton>
              </>
            )}
          </AuthContainer>
          
          {/* Mobile Menu Toggle */}
          <MobileMenuToggle onClick={() => setIsMobileMenuOpen(true)}>
            <FaBars />
          </MobileMenuToggle>
        </NavbarContent>
      </NavbarContainer>
      
      {/* Mobile Menu */}
      <MobileMenu open={isMobileMenuOpen} darkMode={darkMode}>
        <MobileNavHeader>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Logo>
              <FaFeatherAlt />
              <LogoText>Wordsmith</LogoText>
            </Logo>
          </Link>
          
          <CloseButton onClick={() => setIsMobileMenuOpen(false)}>
            <FaTimes />
          </CloseButton>
        </MobileNavHeader>
        
        <MobileSearchContainer>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <SearchButton onClick={handleSearch}>
            <FaSearch />
          </SearchButton>
        </MobileSearchContainer>
        
        <MobileNavLinks>
          <MobileNavLink 
            active={isActive('/')} 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Link to="/">
              <FaHome />
              Home
            </Link>
          </MobileNavLink>
          
          <MobileNavLink 
            active={isActive('/explore')} 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Link to="/explore">
              <FaCompass />
              Explore
            </Link>
          </MobileNavLink>
          
          <MobileNavLink 
            active={isActive('/categories')}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Link to="/categories">
              <FaBook />
              Categories
            </Link>
          </MobileNavLink>
          
          <MobileNavLink 
            active={isActive('/about')} 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Link to="/about">
              <FaUser />
              About
            </Link>
          </MobileNavLink>
          
          <MobileNavLink 
            active={isActive('/contact')} 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Link to="/contact">
              <FaEnvelope />
              Contact
            </Link>
          </MobileNavLink>
        </MobileNavLinks>
        
        <MobileFooter>
          {isAuthenticated ? (
            <>
              <WriteBtnMobile onClick={() => {
                navigate('/create-post');
                setIsMobileMenuOpen(false);
              }}>
                <FaFeatherAlt />
                Write a Post
              </WriteBtnMobile>
              
              <MobileNavLink onClick={() => {
                navigate('/dashboard');
                setIsMobileMenuOpen(false);
              }}>
                <FaUser />
                Dashboard
              </MobileNavLink>
              
              <MobileNavLink onClick={handleLogout}>
                <FaSignOutAlt />
                Logout
              </MobileNavLink>
            </>
          ) : (
            <>
              <AuthButton secondary fullWidth onClick={() => {
                navigate('/login');
                setIsMobileMenuOpen(false);
              }}>
                Login
              </AuthButton>
              
              <AuthButton primary fullWidth onClick={() => {
                navigate('/signup');
                setIsMobileMenuOpen(false);
              }}>
                Sign Up
              </AuthButton>
            </>
          )}
          
          <DarkModeToggle mobile onClick={() => setDarkMode(!darkMode)}>
            <ThemeIcon>{darkMode ? <FaSun /> : <FaMoon />}</ThemeIcon>
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </DarkModeToggle>
        </MobileFooter>
      </MobileMenu>
      
      {/* Bottom Navigation for Mobile */}
      <BottomNavigation darkMode={darkMode}>
        <BottomNavItem active={isActive('/')} onClick={() => navigate('/')}>
          <FaHome />
          <span>Home</span>
        </BottomNavItem>
        
        <BottomNavItem active={isActive('/explore')} onClick={() => navigate('/explore')}>
          <FaCompass />
          <span>Explore</span>
        </BottomNavItem>
        
        {isAuthenticated ? (
          <>
            <BottomNavItem action onClick={() => navigate('/create-post')}>
              <FaFeatherAlt />
              <span>Write</span>
            </BottomNavItem>
            
            <BottomNavItem active={isActive('/bookmarks')} onClick={() => navigate('/bookmarks')}>
              <FaBookmark />
              <span>Saved</span>
            </BottomNavItem>
            
            <BottomNavItem active={isActive('/dashboard')} onClick={() => navigate('/dashboard')}>
              <FaUser />
              <span>Profile</span>
            </BottomNavItem>
          </>
        ) : (
          <>
            <BottomNavItem action onClick={() => navigate('/login')}>
              <FaFeatherAlt />
              <span>Write</span>
            </BottomNavItem>
            
            <BottomNavItem active={isActive('/categories')} onClick={() => navigate('/categories')}>
              <FaBook />
              <span>Categories</span>
            </BottomNavItem>
            
            <BottomNavItem onClick={() => navigate('/login')}>
              <FaUser />
              <span>Login</span>
            </BottomNavItem>
          </>
        )}
      </BottomNavigation>
    </>
  );
};

export default TopNavigationBar; 