import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
`;

export const ChildContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: auto;
    flex: 1;
    overflow: hidden;
    width: 100%;
`;

export const TopNav = styled.div`
    position: sticky;
    top: 0;
    height: 60px;
    z-index: 100;
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
`;

export const SidePanelWrapper = styled.div`
    border-left: 1px solid #e5e7eb;    
    border-right: 1px solid #e5e7eb;
    width: 14%;
    min-width: 281px;
    background-color: white;
    height: calc(100vh - 60px);
    overflow-y: auto;
    
    @media (max-width: 768px) {
        position: fixed;
        top: 60px;
        left: 0;
        bottom: 0;
        z-index: 99;
        transform: translateX(${props => props.isMobile ? '0' : '-100%'});
        transition: transform 0.3s ease;
        box-shadow: ${props => props.isMobile ? '0 4px 20px rgba(0, 0, 0, 0.15)' : 'none'};
    }
`;

export const MainContentWrapper = styled.div`
    border-right: 1px solid #e5e7eb;
    width: 60%;
    background-color: oklch(0.984 0.003 247.858);
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);
    overflow-y: auto;
    
    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const TopBarWrapper = styled.div`
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    background-color: rgba(255,255,255,0.8);
    min-height: 60px;
    backdrop-filter: blur(8px);
    z-index: 10;
    border-bottom: 1px solid #e5e7eb;
`;

export const TopBarContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

export const LeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

export const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

export const PageTitle = styled.h1`
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: #333;
`;

export const SearchBar = styled.div`
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

export const SearchInput = styled.input`
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

export const MobileToggle = styled.div`
    display: none;
    
    @media (max-width: 768px) {
        display: block;
    }
`;

export const BreadcrumbContainer = styled.div`
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    color: #6b7280;
    margin-top: 0.5rem;
`;

export const BreadcrumbItem = styled.span`
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