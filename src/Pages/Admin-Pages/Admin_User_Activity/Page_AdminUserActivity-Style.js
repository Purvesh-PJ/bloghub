import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    margin : 1rem;
    border-radius : 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    background-color: white;
`;

export const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
    margin-left : 0.4rem;
`;

export const HeaderActions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0rem;
    // border : 1px solid gray;
`;

export const SearchContainer = styled.div`
    position: relative;
    width: 280px;
    min-width: 180px;
`;

export const SearchInput = styled.input`
    width: 80%;
    padding: 0.6rem;
    padding-left: 2.25rem;
    border-radius: 0.5rem;
    border: 1px solid #d1d5db;
    font-size: 0.75rem;
    color: #4b5563;
    
    &:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 1px #2563eb;
    }
`;

export const SearchIcon = styled.div`
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    color: #9ca3af;
`;

export const FilterContainer = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
`;

export const FilterSelect = styled.select`
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    font-size: 0.875rem;
    color: #4b5563;
    background-color: white;
    
    &:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 1px #2563eb;
    }
`;

export const DateRangeContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
`;

export const DateInput = styled.input`
    padding: 0.5rem 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    font-size: 0.75rem;
    color: oklch(27.9% 0.041 260.031);
    background-color: white;
    
    &:focus {
        outline: none;
        border-color: oklch(55.1% 0.027 264.364);
        box-shadow: 0 0 0 1px oklch(55.1% 0.027 264.364);
    }
`;

export const CardContainer = styled.div`
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    flex: 1;
`;

export const ActivityList = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ActivityItem = styled.div`
    display: flex;
    padding: 0.5rem 0.5rem;
    border-bottom: 1px solid #e5e7eb;
    
    &:last-child {
        border-bottom: none;
    }
`;

export const ActivityIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 9999px;
    margin-right: 1rem;
    flex-shrink: 0;
    
    &.login {
        background-color: #e0f2fe;
        color: #0284c7;
    }
    
    &.post {
        background-color: #dcfce7;
        color: #16a34a;
    }
    
    &.comment {
        background-color: #fef3c7;
        color: #d97706;
    }
    
    &.like {
        background-color: #fee2e2;
        color: #dc2626;
    }
    
    &.update {
        background-color: #e0e7ff;
        color: #4f46e5;
    }
    
    &.delete {
        background-color: #fae8ff;
        color: #c026d3;
    }
`;

export const ActivityContent = styled.div`
    flex: 1;
`;

export const ActivityHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.2rem;
`;

export const ActivityUser = styled.span`
    font-weight: 500;
    color: oklch(20.8% 0.042 265.755);
    font-size: 0.75rem;
`;

export const ActivityTime = styled.span`
    font-size: 0.75rem;
    color: oklch(20.8% 0.042 265.755);
`;

export const ActivityDescription = styled.p`
    font-size: 0.75rem;
    color: oklch(37.2% 0.044 257.287);
    margin: 0;
`;

export const ActivityMeta = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: oklch(20.8% 0.042 265.755);
`;

export const ActivityMetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

export const Pagination = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
`;

export const PaginationInfo = styled.div`
    font-size: 0.75rem;
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
    color: #6b7280;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
        background-color: #f9fafb;
        color: #4b5563;
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    &.active {
        background-color: oklch(27.9% 0.041 260.031);
        color: white;
        border-color: oklch(55.1% 0.027 264.364);
    }
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
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
    color: #9ca3af;
`;

export const EmptyStateTitle = styled.h3`
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
`;

export const EmptyStateText = styled.p`
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
`;

export const Button = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.75rem;
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
        color: oklch(55.4% 0.046 257.417);
        border: 2px solid oklch(70.4% 0.04 256.788);
        
        &:hover {
            color: oklch(37.2% 0.044 257.287);
            border : 2px solid oklch(55.4% 0.046 257.417);
        }
    }
`;
