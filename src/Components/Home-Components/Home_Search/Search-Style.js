import styled, { keyframes } from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

export const Container = styled.div`
    width: 850px;
    max-width: 90vw;
    border-radius: 12px;
    background-color: ${props => props.darkMode ? '#1a1a1a' : 'white'};
    box-shadow: 0 8px 30px rgba(0, 0, 0, ${props => props.darkMode ? '0.3' : '0.15'});
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: ${fadeIn} 0.3s ease-out;
    
    @media (max-width: 900px) {
        width: 95vw;
    }
`;

export const SearchInput = styled.div`
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid ${props => props.darkMode ? '#2d3748' : '#e2e8f0'};
    position: sticky;
    top: 0;
    background-color: ${props => props.darkMode ? '#1a1a1a' : 'white'};
    z-index: 10;
`;

export const InputField = styled.input`
    flex: 1;
    outline: none;
    border: none;
    padding: 0 12px;
    font-size: 1rem;
    color: ${props => props.darkMode ? '#e2e8f0' : '#1e293b'};
    background-color: transparent;
    
    &::placeholder {
        color: ${props => props.darkMode ? '#94a3b8' : '#94a3b8'};
    }
`;

export const Searchicon = styled(SearchIcon)`
    color: ${props => props.color || '#64748b'};
    font-size: 1.5rem !important;
`;

export const Closeicon = styled(CloseIcon)`
    color: ${props => props.color || '#64748b'};
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
        color: #ef4444;
    }
`;

export const ClearButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: ${props => props.darkMode ? '#94a3b8' : '#94a3b8'};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    padding: 0;
    margin-right: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
        color: ${props => props.darkMode ? 'white' : '#1e293b'};
    }
    
    svg {
        font-size: 18px;
    }
`;

// Search results container and inside element Styles
export const SearchResultContainer = styled.div`
    max-height: 70vh;
    overflow-y: auto;
    background-color: ${props => props.darkMode ? '#1a1a1a' : 'white'};
    
    /* Scrollbar styling */
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: ${props => props.darkMode ? '#2d3748' : '#f1f5f9'};
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${props => props.darkMode ? '#4a5568' : '#cbd5e1'};
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: ${props => props.darkMode ? '#718096' : '#94a3b8'};
    }
`;

export const ResultsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid ${props => props.darkMode ? '#2d3748' : '#e2e8f0'};
    position: sticky;
    top: 0;
    background-color: ${props => props.darkMode ? '#1a1a1a' : 'white'};
    z-index: 5;
`;

export const ResultStats = styled.div`
    font-size: 0.875rem;
    color: ${props => props.darkMode ? '#94a3b8' : '#64748b'};
    font-weight: 500;
`;

export const ResultActions = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

export const FilterButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid ${props => props.darkMode ? '#2d3748' : '#e2e8f0'};
    background-color: ${props => props.darkMode ? '#2d3748' : 'white'};
    color: ${props => props.darkMode ? '#e2e8f0' : '#64748b'};
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    
    &:hover {
        background-color: ${props => props.darkMode ? '#4a5568' : '#f8fafc'};
    }
`;

export const FilterIcon = styled(FiFilter)`
    font-size: 0.875rem;
`;

export const FilterDropdown = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    width: 180px;
    background-color: ${props => props.darkMode ? '#2d3748' : 'white'};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, ${props => props.darkMode ? '0.3' : '0.1'});
    overflow: hidden;
    margin-top: 8px;
    z-index: 10;
    animation: ${fadeIn} 0.2s ease-out;
`;

export const FilterItem = styled.div`
    padding: 10px 14px;
    font-size: 0.875rem;
    cursor: pointer;
    background-color: ${props => props.active ? 
        (props.darkMode ? '#4a5568' : '#f1f5f9') : 'transparent'
    };
    color: ${props => {
        if (props.darkMode) {
            return props.active ? 'white' : '#e2e8f0';
        } else {
            return props.active ? '#2563eb' : '#1e293b';
        }
    }};
    font-weight: ${props => props.active ? '500' : 'normal'};
    transition: all 0.2s;
    
    &:hover {
        background-color: ${props => props.darkMode ? '#4a5568' : '#f1f5f9'};
    }
`;

export const PostContainer = styled.div`
    padding: 16px 20px;
    border-bottom: 1px solid ${props => props.darkMode ? '#2d3748' : '#e2e8f0'};
    transition: background-color 0.2s;
    
    .post-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        
        @media (max-width: 600px) {
            flex-direction: column;
            gap: 8px;
        }
    }
    
    &:hover {
        background-color: ${props => props.darkMode ? '#2d3748' : '#f8fafc'};
    }
`;

export const PostHeading = styled.h2`
    font-size: 1.125rem;
    line-height: 1.3;
    margin: 0;
    color: ${props => props.darkMode ? '#e2e8f0' : '#1e293b'};
    font-weight: 600;
    flex: 1;
`;

export const ResultCategory = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background-color: ${props => props.darkMode ? 'rgba(79, 209, 197, 0.1)' : 'rgba(79, 209, 197, 0.1)'};
    color: ${props => props.darkMode ? '#4fd1c5' : '#0d9488'};
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    
    svg {
        font-size: 0.875rem;
    }
`;

export const PostContent = styled.p`
    font-size: 0.9375rem;
    line-height: 1.5;
    margin: 8px 0 12px 0;
    color: ${props => props.darkMode ? '#cbd5e1' : '#475569'};
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
`;

export const PostDate = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: ${props => props.darkMode ? '#94a3b8' : '#64748b'};
    
    svg {
        font-size: 0.875rem;
    }
`;

export const HighlightedText = styled.span`
    background-color: rgba(59, 130, 246, 0.2);
    color: ${props => props.darkMode ? '#60a5fa' : '#2563eb'};
    padding: 0 2px;
    border-radius: 2px;
    font-weight: 500;
`;

export const NavLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: block;
    
    &:focus {
        outline: 2px solid ${props => props.darkMode ? '#60a5fa' : '#3b82f6'};
        outline-offset: -2px;
    }
`;

export const Loading = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: ${props => props.darkMode ? '#cbd5e1' : '#64748b'};
    gap: 16px;
    
    span {
        font-size: 0.9375rem;
    }
`;

export const SearchLoadingSpinner = styled.div`
    width: 36px;
    height: 36px;
    border: 3px solid ${props => props.darkMode ? '#2d3748' : '#e2e8f0'};
    border-top-color: ${props => props.darkMode ? '#60a5fa' : '#3b82f6'};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: ${props => props.darkMode ? '#94a3b8' : '#64748b'};
    text-align: center;
    
    h3 {
        margin: 16px 0 8px 0;
        font-weight: 500;
        font-size: 1.125rem;
        color: ${props => props.darkMode ? '#e2e8f0' : '#1e293b'};
    }
    
    p {
        margin: 0;
        font-size: 0.9375rem;
        max-width: 300px;
    }
    
    svg {
        color: ${props => props.darkMode ? '#4a5568' : '#cbd5e1'};
    }
`;

export const SearchEmptyIcon = styled(FiSearch)`
    font-size: 40px;
`;

export const SearchHint = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    font-size: 0.9375rem;
    color: ${props => props.darkMode ? '#94a3b8' : '#64748b'};
    border-bottom: 1px solid ${props => props.darkMode ? '#2d3748' : '#e2e8f0'};
    
    svg {
        font-size: 1rem;
    }
`;

export const RecentSearches = styled.div`
    padding: 16px 0;
    animation: ${fadeIn} 0.3s ease-out;
`;

export const RecentSearchTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 12px 20px;
    color: ${props => props.darkMode ? '#e2e8f0' : '#1e293b'};
    font-size: 0.9375rem;
    font-weight: 500;
`;

export const ClearHistoryButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: ${props => props.darkMode ? '#94a3b8' : '#64748b'};
    font-size: 0.8125rem;
    cursor: pointer;
    padding: 5px 8px;
    border-radius: 4px;
    transition: all 0.2s;
    
    &:hover {
        background-color: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
        color: ${props => props.darkMode ? '#e2e8f0' : '#1e293b'};
    }
    
    svg {
        font-size: 0.875rem;
    }
`;

export const RecentSearchItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    cursor: pointer;
    color: ${props => props.darkMode ? '#cbd5e1' : '#475569'};
    transition: all 0.2s;
    
    svg {
        color: ${props => props.darkMode ? '#94a3b8' : '#94a3b8'};
        font-size: 1rem;
    }
    
    &:hover {
        background-color: ${props => props.darkMode ? '#2d3748' : '#f8fafc'};
    }
`;