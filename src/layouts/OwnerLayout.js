import React, { useState, useEffect } from 'react';
import { 
  Container, 
  ChildContainer, 
  TopNav, 
  SidePanelWrapper, 
  MainContentWrapper, 
  TopBarWrapper
} from './OwnerLayout-Style';
import { SidePanel } from '../Components/Resuable-Components/SidePanel';
import { Outlet, useLocation } from 'react-router-dom';
import { IoArrowBackOutline, IoSettingsOutline, IoHelpCircleOutline, IoSearch } from "react-icons/io5";
import MultiUseButton from '../Components/UI-Components/Button/MultiUseButton';
import { useNavigationHistory } from '../context/NavigationHistoryContext';
import styled from 'styled-components';
import { CircleHelp, Settings2 } from 'lucide-react';

// Updated styled components for the single-line breadcrumb and title
const TopBarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TitleAndBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PageTitle = styled.h1`
  font-size: 0.90rem;
  font-weight: 600;
  margin: 0;
  color: #333;
  text-align: center;
  // border-radius: 0.7rem;
  // padding-left: 0.5rem;
  // padding-right: 0.5rem;
  // background-color: #f3f4f6;
  // border: 1px solid #e5e7eb;
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #6b7280;
`;

const BreadcrumbItem = styled.span`
  &:not(:last-child)::after {
    content: '/';
    margin: 0 0.5rem;
    color: #d1d5db;
  }
  
  &:last-child {
    color: #4b5563;
    font-weight: 500;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem 0 1rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  max-width: 300px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 0.9rem;
  margin-left: 0.5rem;
  color: #4b5563;
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const MobileToggle = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// Style to center the TopNav content horizontally
const CenteredTopNav = styled(TopNav)`
  display: flex;
  justify-content: center;
  align-items: center;
  
  & > * {
    max-width: 1200px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

const OwnerLayout = ({ User, ListData }) => {
    const { goBack } = useNavigationHistory();
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState('Dashboard');
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Generate page title and breadcrumbs from current path
    useEffect(() => {
        const path = location.pathname;
        const segments = path.split('/').filter(segment => segment);
        
        if (segments.length > 0) {
            // Generate page title from the last segment
            const lastSegment = segments[segments.length - 1];
            const formattedTitle = lastSegment
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            setPageTitle(formattedTitle);
            
            // Generate breadcrumbs
            const crumbs = [];
            crumbs.push({ label: 'Home', path: '/' });
            
            let currentPath = '';
            segments.forEach(segment => {
                currentPath += `/${segment}`;
                const formattedLabel = segment
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                crumbs.push({ label: formattedLabel, path: currentPath });
            });
            
            setBreadcrumbs(crumbs);
        } else {
            setPageTitle('Dashboard');
            setBreadcrumbs([{ label: 'Home', path: '/' }]);
        }
    }, [location]);
    
    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };
    
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        // You could implement actual search functionality here
    };

    return (
        <Container>
            <CenteredTopNav />
            <ChildContainer>
                <SidePanelWrapper isMobile={isMobileSidebarOpen}>
                    <SidePanel User={User} ListData={ListData} />
                </SidePanelWrapper>

                <MainContentWrapper>
                    <TopBarWrapper>
                        <TopBarContent>
                            <LeftSection>
                                <MultiUseButton 
                                    iconbtn 
                                    icon={<IoArrowBackOutline/>} 
                                    size={'x-lg'} 
                                    onClick={goBack}
                                    aria-label="Go back"
                                />
                                
                                <TitleAndBreadcrumb>
                                    <PageTitle>{pageTitle}</PageTitle>
                                    {/* <BreadcrumbContainer>
                                        {breadcrumbs.map((crumb, index) => (
                                            <BreadcrumbItem key={index}>
                                                {crumb.label}
                                            </BreadcrumbItem>
                                        ))}
                                    </BreadcrumbContainer> */}
                                </TitleAndBreadcrumb>
                            </LeftSection>
                            
                            <RightSection>
                                <SearchBar>
                                    <IoSearch color="#6b7280" />
                                    <SearchInput 
                                        type="text" 
                                        placeholder="Search..." 
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                </SearchBar>
                                
                                <MultiUseButton 
                                    iconbtn 
                                    icon={<CircleHelp size={18} strokeWidth={2} color="oklch(37.2% 0.044 257.287)"/>} 
                                    size='lg' 
                                    aria-label="Help"
                                    
                                />
                                
                                <MultiUseButton 
                                    iconbtn 
                                    size='lg' 
                                    icon={<Settings2 size={18} strokeWidth={2} color="oklch(37.2% 0.044 257.287)" />} 
                                    aria-label="Settings"
                                />
                                
                                <MobileToggle>
                                    <MultiUseButton 
                                        iconbtn 
                                        icon={isMobileSidebarOpen ? "✕" : "☰"} 
                                        size={'lg'} 
                                        onClick={toggleMobileSidebar}
                                        aria-label={isMobileSidebarOpen ? "Close sidebar" : "Open sidebar"}
                                    />
                                </MobileToggle>
                            </RightSection>
                        </TopBarContent>
                    </TopBarWrapper>
                    <Outlet/>
                </MainContentWrapper>
            </ChildContainer>
        </Container>
    );
};

export default OwnerLayout;