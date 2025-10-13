import React, { useState, useEffect } from 'react';

import {
  Container,
  ChildContainer,
  TopNav,
  SidePanelWrapper,
  MainContentWrapper,
  TopBarWrapper,
  MobileBackdrop,
} from './OwnerLayout.styles';
import { SidePanel } from '@/shared';
import { Outlet, useLocation } from 'react-router-dom';
import { IoArrowBackOutline, IoSearch } from 'react-icons/io5';
import MultiUseButton from '@/shared/components/Button/MultiUseButton';
import { useNavigationHistory } from '../context/NavigationHistoryContext';
import styled from 'styled-components';
import { CircleHelp, Settings2 } from 'lucide-react';
import {
  Container as UiContainer,
  Flex,
  Breadcrumbs,
  H6,
  SearchInput as UiSearchInput,
} from '../components/ui/primitives';

const MobileToggle = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
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
    const segments = path.split('/').filter((segment) => segment);

    if (segments.length > 0) {
      // Generate page title from the last segment
      const lastSegment = segments[segments.length - 1];
      const formattedTitle = lastSegment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setPageTitle(formattedTitle);
      // Generate breadcrumbs
      const crumbs = [];
      crumbs.push({ label: 'Home', path: '/' });

      let currentPath = '';
      segments.forEach((segment) => {
        currentPath += `/${segment}`;
        const formattedLabel = segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
      <TopNav />
      <ChildContainer>
        <MobileBackdrop
          $isOpen={isMobileSidebarOpen}
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
        <SidePanelWrapper isMobile={isMobileSidebarOpen}>
          <SidePanel User={User} ListData={ListData} />
        </SidePanelWrapper>
        <MainContentWrapper>
          <TopBarWrapper>
            <UiContainer $max="1200px">
              <Flex $align="center" $justify="space-between">
                <Flex $align="center" $gap={4}>
                  <MultiUseButton
                    iconbtn
                    icon={<IoArrowBackOutline />}
                    size="x-lg"
                    onClick={goBack}
                    aria-label="Go back"
                  />
                  <Flex $align="center" $gap={3}>
                    <H6 style={{ margin: 0 }}>{pageTitle}</H6>
                    <Breadcrumbs $size="sm">
                      {breadcrumbs.map((crumb, index) => (
                        <Breadcrumbs.Item key={index} $active={index === breadcrumbs.length - 1}>
                          {index < breadcrumbs.length - 1 ? (
                            <>
                              <Breadcrumbs.Link to={crumb.path}>{crumb.label}</Breadcrumbs.Link>
                              <Breadcrumbs.Separator>/</Breadcrumbs.Separator>
                            </>
                          ) : (
                            crumb.label
                          )}
                        </Breadcrumbs.Item>
                      ))}
                    </Breadcrumbs>
                  </Flex>
                </Flex>

                <Flex $align="center" $gap={4}>
                  <UiSearchInput.Wrapper $maxWidth="300px">
                    <UiSearchInput.Icon $size="md">
                      <IoSearch />
                    </UiSearchInput.Icon>
                    <UiSearchInput
                      $size="md"
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </UiSearchInput.Wrapper>

                  <MultiUseButton
                    iconbtn
                    icon={<CircleHelp size={18} strokeWidth={2} />}
                    size="lg"
                    aria-label="Help"
                  />

                  <MultiUseButton
                    iconbtn
                    size="lg"
                    icon={<Settings2 size={18} strokeWidth={2} />}
                    aria-label="Settings"
                  />

                  <MobileToggle>
                    <MultiUseButton
                      iconbtn
                      icon={isMobileSidebarOpen ? '✕' : '☰'}
                      size={'lg'}
                      onClick={toggleMobileSidebar}
                      aria-label={isMobileSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                    />
                  </MobileToggle>
                </Flex>
              </Flex>
            </UiContainer>
          </TopBarWrapper>
          <Outlet />
        </MainContentWrapper>
      </ChildContainer>
    </Container>
  );
};

export default OwnerLayout;
