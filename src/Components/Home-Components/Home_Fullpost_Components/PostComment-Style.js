import styled, { keyframes, css } from 'styled-components';
import SendIcon from '@mui/icons-material/Send';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ParentContainer = styled.div`
    background-color: #f8fafc;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    animation: ${slideIn} 0.3s ease forwards;
`;

export const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0;
    }
`;

export const LoginPrompt = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    color: #f97316;
    
    svg {
        font-size: 1rem;
    }
`;

export const EditorWrapper = styled.div`
    position: relative;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: white;
    overflow: hidden;
    transition: border-color 0.2s;
    
    &:focus-within {
        border-color: #64748b;
    }
    
    .error-message {
        margin: 8px 12px;
        font-size: 0.875rem;
        color: #ef4444;
    }
`;

export const CommentEditor = styled.textarea`
    width: 100%;
    min-height: 120px;
    padding: 16px;
    border: none;
    resize: vertical;
    font-family: inherit;
    font-size: 1rem;
    color: #1e293b;
    outline: none;
    
    &::placeholder {
        color: #94a3b8;
    }
    
    &:disabled {
        background-color: #f8fafc;
        cursor: not-allowed;
    }
`;

export const CharacterCount = styled.div`
    text-align: right;
    padding: 8px 12px;
    font-size: 0.75rem;
    color: ${props => props.$exceeds ? '#ef4444' : '#94a3b8'};
    border-top: 1px solid #e2e8f0;
`;

export const PostButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const SendMessageIcon = styled(SendIcon)`
    font-size: 1.125rem;
    margin-left: 8px;
`;

export const AnimatedButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 140px;
    padding: 12px 24px;
    font-size: 0.9375rem;
    font-weight: 500;
    color: white;
    background-color: #2563eb;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    ${props => props.$isLoading && css`
        background-color: #3b82f6;
        animation: ${pulse} 1.5s infinite ease-in-out;
    `}
    
    &:hover:not(:disabled) {
        background-color: #1d4ed8;
        transform: translateY(-2px);
    }
    
    &:active:not(:disabled) {
        transform: translateY(0);
    }
    
    &:disabled {
        background-color: #cbd5e1;
        cursor: not-allowed;
    }
`;


