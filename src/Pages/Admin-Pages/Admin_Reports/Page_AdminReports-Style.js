import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding : 1rem;
    margin : 1rem;
    min-width: 320px;
    max-width: 1200px;
    // width: 100%;
    box-sizing: border-box;
`;

export const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

export const Title = styled.h1`
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
    margin-left : 0.4rem;
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: 0.75rem;
`;

export const FilterContainer = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    min-width: 150px;
    
    @media (max-width: 480px) {
        width: 100%;
    }
`;

export const FilterSelect = styled.select`
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    font-size: 0.75rem;
    color: oklch(55.4% 0.046 257.417);
    background-color: white;
    min-width: 120px;
    
    &:focus {
        outline: none;
        border-color: oklch(55.4% 0.046 257.417);
        box-shadow: 0 0 0 1px oklch(55.4% 0.046 257.417);
    }
    
    @media (max-width: 480px) {
        width: 100%;
    }
`;

export const CardContainer = styled.div`
    background-color : oklch(98.4% 0.003 247.858);
    overflow: hidden;
    flex: 1;
    border-radius : 1rem;
    min-height: 200px;
    position: relative;
    box-sizing: border-box;
`;

export const TabsContainer = styled.div`
    display: flex;
    border-bottom: 1px solid oklch(92.9% 0.013 255.508);
    min-height: 48px;
    overflow-x: auto;
    
    @media (max-width: 480px) {
        justify-content: space-between;
    }
`;

export const Tab = styled.button`
display : flex;
align-items: center;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: oklch(55.4% 0.046 257.417);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &.active {
        color: oklch(27.9% 0.041 260.031);
        border-bottom: 2px solid oklch(27.9% 0.041 260.031);
    }
    
    &:hover:not(.active) {
        color: oklch(27.9% 0.041 260.031);
    }
`;

export const ReportList = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 200px;
    position: relative;
`;

export const ReportItem = styled.div`
    padding: 0.8rem 1rem 0.5rem 1rem;
    border-bottom: 1px solid oklch(92.9% 0.013 255.508);
    min-height: 100px;

    &:last-child {
        border-bottom: none;
    }
`;

export const ReportHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
`;

export const ReportInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ReportTitle = styled.h3`
    font-size: 0.8rem;
    font-weight: 600;
    color:oklch(20.8% 0.042 265.755);
    margin-bottom: 0.25rem;
`;

export const ReportMeta = styled.div`
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: oklch(20.8% 0.042 265.755);
`;

export const ReportMetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

export const ReportStatus = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export const StatusBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    
    &.pending {
        background-color: oklch(96.8% 0.007 247.896);
        color: oklch(27.9% 0.041 260.031);
    }
    
    &.reviewing {
        background-color: #e0f2fe;
        color: #0284c7;
    }
    
    &.resolved {
        background-color: #dcfce7;
        color: #16a34a;
    }
    
    &.rejected {
        background-color: #fee2e2;
        color: #dc2626;
    }
`;

export const ReportContent = styled.div`
    margin-bottom: 1rem;
    min-height: 50px;
`;

export const ReportReason = styled.div`
    font-size: 0.80rem;
    color: oklch(37.2% 0.044 257.287);
    margin-bottom: 0.5rem;
`;

export const ReportedContent = styled.div`
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    border-left: 1px solid oklch(55.4% 0.046 257.417);
    font-size: 0.75rem;
    color: oklch(55.4% 0.046 257.417);
    margin-bottom: 1rem;
`;

export const ReportActions = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    min-height: 32px;
    
    @media (max-width: 480px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

export const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.32rem 0.6rem 0.32rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &.primary {
        background-color: oklch(27.9% 0.041 260.031);
        color: white;
        border: none;
        
        &:hover {
            background-color: oklch(37.2% 0.044 257.287);
        }
    }
    
    &.secondary {
        background-color: white;
        color: oklch(37.2% 0.044 257.287);
        border: 2px solid oklch(55.4% 0.046 257.417);
        
        &:hover {
            background-color: #f9fafb;
        }
    }
    
    &.danger {
        background-color: oklch(63.7% 0.237 25.331);
        color: white;
        border: none;
        
        &:hover {
            background-color: oklch(73.7% 0.237 25.331);
        }
    }
    
    &.success {
        background-color: oklch(72.3% 0.219 149.579);
        color: white;
        border: none;
        
        &:hover {
            background-color: oklch(82.3% 0.219 149.579);
        }
    }
`;

export const Pagination = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    min-height: 60px;
    
    @media (max-width: 640px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

export const PaginationInfo = styled.div`
    font-size: 0.875rem;
    color: #6b7280;
`;

export const PaginationButtons = styled.div`
    display: flex;
    gap: 0.5rem;
`;

export const PaginationButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    background-color: white;
    color: oklch(37.2% 0.044 257.287);
    border: 1px solid oklch(55.4% 0.046 257.417);
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
        background-color: #f9fafb;
        color: oklch(37.2% 0.044 257.287);
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    &.active {
        background-color: oklch(27.9% 0.041 260.031);
        color: white;
        border-color: oklch(27.9% 0.041 260.031);
    }
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    text-align: center;
`;

export const EmptyStateIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background-color: #f3f4f6;
    border-radius: 9999px;
    margin-bottom: 1rem;
    color: oklch(37.2% 0.044 257.287);
`;

export const EmptyStateTitle = styled.h3`
    font-size: 0.875rem;
    font-weight: 600;
    color: oklch(37.2% 0.044 257.287);
    margin-bottom: 0.5rem;
`;

export const EmptyStateText = styled.p`
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
`;

export const LoadingOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 1rem;
`;

export const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid oklch(92.9% 0.013 255.508);
    border-radius: 50%;
    border-top-color: oklch(27.9% 0.041 260.031);
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

export const LoadingText = styled.p`
    font-size: 0.875rem;
    color: oklch(37.2% 0.044 257.287);
    font-weight: 500;
`;

export const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    min-height: 200px;
    background-color: #fef2f2;
    border-radius: 1rem;
    border: 1px solid #fee2e2;
`;

export const ErrorIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background-color: #fee2e2;
    border-radius: 9999px;
    margin-bottom: 1rem;
    color: #dc2626;
`;

export const ErrorTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: #dc2626;
    margin-bottom: 0.5rem;
`;

export const ErrorMessage = styled.p`
    font-size: 0.875rem;
    color: #ef4444;
    margin-bottom: 1.5rem;
`;

export const RetryButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: white;
    color: #dc2626;
    border: 1px solid #dc2626;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #fee2e2;
    }
`;
