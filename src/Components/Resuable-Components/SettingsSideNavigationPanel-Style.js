import styled from "styled-components";
import { Link } from 'react-router-dom';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    padding: 1rem 1rem;
`;

export const Heading = styled.h2`
    font-size: 0.75rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid #f1f5f9;
`;

export const ListItemContainer = styled.div`
    width: 100%;
`;

export const LinkLocation = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.50rem;
    border-radius: 8px;
    text-decoration: none;
    color: oklch(44.6% 0.043 257.281);
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: oklch(0.968 0.007 247.896);
        color: oklch(0.208 0.042 265.755);
    }
    
    &.active {
        background-color: oklch(0.968 0.007 247.896);
        color: oklch(27.9% 0.041 260.031);
        font-weight: 500;
        
        svg {
            color: oklch(27.9% 0.041 260.031);
        }
        
        &:hover {
            background-color: oklch(0.968 0.007 247.896);
        }
    }
`;

export const Icon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.895rem;
    color: oklch(44.6% 0.043 257.281);
    width: 1.5rem;
    height: 1.5rem;
`;

export const ItemName = styled.span`
    font-size: 0.75rem;
`;  