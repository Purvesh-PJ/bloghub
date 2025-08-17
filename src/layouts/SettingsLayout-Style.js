import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    background-color: #f8fafc;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    box-sizing: border-box;
    
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const SidePanelWrapper = styled.aside`
    width: 250px;
    min-width: 250px;
    background: white;
    border-right: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    height: 100%;
    max-height: 100%;
    padding: 0;
    overflow-y: auto;
    
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #e2e8f0;
        border-radius: 20px;
    }
    
    &:hover::-webkit-scrollbar-thumb {
        background-color: #cbd5e1;
    }
    
    @media (max-width: 768px) {
        position: static;
        width: 100%;
        min-width: 100%;
        height: auto;
        border-right: none;
        border-bottom: 1px solid #e2e8f0;
    }
`;

export const MainPanelWrapper = styled.div`
    flex: 1;
    padding: 1rem;
    background-color: oklch(0.984 0.003 247.858);
    overflow-y: auto;
    
    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

export const SettingsHeader = styled.div`
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
`;

export const SettingsTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
`;

export const SettingsDescription = styled.p`
    font-size: 0.875rem;
    color: #64748b;
    margin: 0.5rem 0 0 0;
    line-height: 1.5;
`;