import React from 'react';
import { 
    LoadingOverlay, 
    LoadingSpinner, 
    LoadingText, 
    ErrorContainer, 
    ErrorIcon, 
    ErrorTitle, 
    ErrorMessage, 
    RetryButton 
} from './StateWrapper.styles';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * A reusable component wrapper that handles loading, error, and normal states
 * while maintaining consistent dimensions during state transitions.
 */
const StateWrapper = ({ 
    loading, 
    error, 
    onRetry, 
    loadingText = 'Loading...', 
    errorTitle = 'Error', 
    children,
    minHeight = '200px',
    style = {}
}) => {
    if (error) {
        return (
            <ErrorContainer style={{ minHeight, ...style }}>
                <ErrorIcon>
                    <AlertCircle size={24} />
                </ErrorIcon>
                <ErrorTitle>{errorTitle}</ErrorTitle>
                <ErrorMessage>{error}</ErrorMessage>
                {onRetry && (
                    <RetryButton onClick={onRetry}>
                        <RefreshCw size={16} />
                        Retry
                    </RetryButton>
                )}
            </ErrorContainer>
        );
    }

    return (
        <div style={{ position: 'relative', minHeight, ...style }}>
            {loading && (
                <LoadingOverlay>
                    <LoadingSpinner />
                    <LoadingText>{loadingText}</LoadingText>
                </LoadingOverlay>
            )}
            {children}
        </div>
    );
};

export default StateWrapper;
