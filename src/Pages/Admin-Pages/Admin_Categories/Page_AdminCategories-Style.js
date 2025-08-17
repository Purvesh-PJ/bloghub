import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    // width: 100%;
    // height: 100%;
    padding: 1rem;
    box-sizing: border-box;
    background-color: white;
    margin : 1rem;
    border-radius : 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
    gap: 0.75rem;
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

export const TabsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #e5e7eb;
    // margin-bottom: 1.5rem;
    border : 1px solid oklch(92.9% 0.013 255.508);
    border-radius: 2rem;
    padding : 0.1rem;
`;

export const Tab = styled.button`
    padding: 0.5rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    color: #6b7280;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &.active {
        color: oklch(27.9% 0.041 260.031);
        // border-bottom: 2px solid oklch(27.9% 0.041 260.031);
        background-color: oklch(96.8% 0.007 247.896);
        border-radius: 2rem;
    }
    
    &:hover:not(.active) {
        color: oklch(27.9% 0.041 260.031);
    }
`;

export const ContentContainer = styled.div`
    display: flex;
    gap: 1rem;
    height: calc(100% - 6rem);
    margin-top: 1rem;
`;

export const LeftPanel = styled.div`
    flex: 1;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    overflow: hidden;
    background-color: oklch(98.4% 0.003 247.858);
`;

export const RightPanel = styled.div`
    flex: 1;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    overflow: hidden;
    background-color: oklch(98.4% 0.003 247.858);
`;

export const PanelHeader = styled.div`
    padding: 0.5rem 0 0 1rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const PanelTitle = styled.h2`
    font-size: 0.75rem;
    font-weight: 500;
    color: oklch(44.6% 0.043 257.281);
    font-family: 'Poppins', sans-serif;
`;

export const PanelContent = styled.div`
    padding: 0.8rem;
    height: calc(100% - 3.5rem);
    overflow-y: auto;
`;

export const CategoryList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const CategoryItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e7eb;
    
    &:last-child {
        border-bottom: none;
    }
`;

export const CategoryName = styled.span`
    font-size: 0.75rem;
    color: oklch(20.8% 0.042 265.755);
`;

export const CategoryCount = styled.span`
    font-size: 0.75rem;
    color: #6b7280;
    background-color: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
`;

export const CategoryActions = styled.div`
    display: flex;
    gap: 0.5rem;
`;

export const ActionButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    background-color: white;
    color: oklch(27.9% 0.041 260.031);
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f9fafb;
        color: #4b5563;
    }
    
    &.delete:hover {
        background-color: #fee2e2;
        color: #dc2626;
        border-color: #fecaca;
    }
`;

export const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

export const Label = styled.label`
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
`;

export const Input = styled.input`
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    color: #1f2937;
    box-sizing: border-box;
    
    &:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 1px #2563eb;
    }
`;

export const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
`;

export const Tag = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background-color: #e5e7eb;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    color: #4b5563;
`;

export const TagText = styled.span``;

export const TagRemove = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #6b7280;
    
    &:hover {
        color: #dc2626;
    }
`;

export const ColorPicker = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
`;

export const ColorOption = styled.button`
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    border: 2px solid transparent;
    cursor: pointer;
    
    &.selected {
        border-color: #2563eb;
    }
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
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
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
`;

export const EmptyStateText = styled.p`
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
`;
