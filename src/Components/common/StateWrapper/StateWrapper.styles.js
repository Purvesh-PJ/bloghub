import styled from 'styled-components';

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
    border-radius: 0.5rem;
`;

export const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid #f3f4f6;
    border-radius: 50%;
    border-top-color: #3b82f6;
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
    color: #4b5563;
    font-weight: 500;
`;

export const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    background-color: #fef2f2;
    border-radius: 0.5rem;
    border: 1px solid #fee2e2;
    width: 100%;
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

// Export a component wrapper that maintains dimensions
export const ComponentWrapper = styled.div`
    min-width: ${props => props.minWidth || '200px'};
    max-width: ${props => props.maxWidth || '100%'};
    min-height: ${props => props.minHeight || 'auto'};
    max-height: ${props => props.maxHeight || 'none'};
    width: ${props => props.width || '100%'};
    height: ${props => props.height || 'auto'};
    position: relative;
    
    @media (max-width: 768px) {
        min-width: ${props => props.mobileMinWidth || props.minWidth || '100%'};
        max-width: ${props => props.mobileMaxWidth || props.maxWidth || '100%'};
    }
`;
