import styled, { keyframes, css } from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import ClearIcon from '@mui/icons-material/Clear';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Shared styles
const focusRingStyles = css`
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    border-color: #3b82f6;
  }
`;

const hoverTransition = css`
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Main container
export const Container = styled.div`
    display: flex;
    width: 100%;
    min-height: 100vh;
    background-color: white;
    padding: 1rem;
    
    @media (max-width: 768px) {
        padding: 0;
    }
`;

// Form
export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    animation: ${fadeIn} 0.3s ease-in-out;
`;

export const FormHeader = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.50rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    
    h1 {
        font-size: 0.75rem;
        font-weight: 500;
        color: #111827;
        margin: 0;
    }
    
    .saving-indicator, .saved-indicator {
        display: flex;
        align-items: center;
        font-size: 0.875rem;
        color: #4b5563;
        
        svg {
            margin-right: 0.5rem;
        }
    }
    
    .saving-indicator {
        color: #6b7280;
    }
    
    .saved-indicator {
        color: #10b981;
    }
    
    .spinner {
        animation: ${spin} 1s linear infinite;
    }
`;

export const MainContent = styled.div`
    display: flex;
    flex-direction: row;
    
    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;

export const EditorContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    min-height: 400px;
    
    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

export const SidebarContainer = styled.aside`
    width: 320px;
    padding: 0.50rem;
    background-color: white;
    border-left: 1px solid #e5e7eb;
    
    @media (max-width: 1024px) {
        width: 100%;
        border-left: none;
        border-top: 1px solid #e5e7eb;
    }
    
    @media (max-width: 768px) {
        padding: 0.50rem;
    }
    
    .visibility-options {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .selected-cats {
        margin-top: 1rem;
    }
    
    .no-categories {
        color: #6b7280;
        font-size: 0.875rem;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export const InputField = styled.div`
    
    margin-bottom: 1rem;
    
    .title-input {
        width: 100%;
        padding: 0.60rem;
        font-size: 0.75rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.375rem;
        margin-top: 0.375rem;
        font-weight: 500;
        color: #111827;
        transition: border-color 0.15s ease;
        
        &::placeholder {
            color: #9ca3af;
            font-weight: 400;
        }
        
        &:hover {
            border-color: #d1d5db;
        }
        
        &:focus {
            ${focusRingStyles}
        }
    }
`;

export const FormFooter = styled.footer`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 1.25rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    gap: 1rem;
    
    button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.6875rem 1.25rem;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
        
        .icon, .spinner {
            margin-right: 0.5rem;
        }
        
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }
    
    .cancel-button {
        background: white;
        color: #4b5563;
        border: 1px solid #d1d5db;
        
        &:hover:not(:disabled) {
            background-color: #f9fafb;
            border-color: #9ca3af;
        }
        
        &:active:not(:disabled) {
            background-color: #f3f4f6;
        }
    }
    
    .submit-button {
        background-color: #3b82f6;
        color: white;
        border: none;
        padding: 0.6875rem 1.5rem;
        
        .spinner {
            animation: ${spin} 1s linear infinite;
        }
        
        &:hover:not(:disabled) {
            background-color: #2563eb;
        }
        
        &:active:not(:disabled) {
            background-color: #1d4ed8;
        }
    }
`;

export const SuccessMessage = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: #d1fae5;
    color: #065f46;
    font-weight: 500;
    animation: ${slideIn} 0.3s ease-out;
    
    svg {
        margin-right: 0.625rem;
    }
`;

// Content editor
export const ContentFieldWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    // border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    overflow: hidden;
    background-color: white;
    // box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    .ql-container {
        font-family: inherit;
        font-size: 0.75rem;
        line-height: 1.6;
        flex: 1;
        border: none;
    }

    .ql-toolbar {
        border: none;
        border-bottom: 1px solid #e5e7eb;
        padding: 0.25rem;
        // background-color: #f9fafb;
    }

    .ql-editor {
        min-height: 300px;
        padding: 1rem 1.25rem;
        
        &.ql-blank::before {
            font-style: normal;
            color: #9ca3af;
        }
    }
    
    .ql-toolbar button {
        margin : 4px;
        &:hover {
            color: #3b82f6;
        }
        
        &.ql-active {
            color: #2563eb;
        }
    }
`;

export const ContentEditorField = styled(ReactQuill)`
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem 1.25rem;
`;

// Status indicators
export const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 4rem 0;
    
    .spinner {
        animation: ${spin} 1s linear infinite;
        color: #3b82f6;
    }
    
    span {
        margin-top: 1rem;
        font-size: 0.75rem;
        color: #4b5563;
    }
`;

export const ErrorContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: #fee2e2;
    color: #b91c1c;
    
    svg {
        flex-shrink: 0;
        margin-right: 0.75rem;
    }
    
    div {
        flex: 1;
    }
    
    button {
        background: none;
        border: none;
        color: #b91c1c;
        cursor: pointer;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
            color: #991b1b;
        }
    }
`;

// Section styling
export const Section = styled.section`
    background-color: oklch(98.4% 0.003 247.858);
    border-radius: 0.5rem;
    // border: 1px solid #e5e7eb;
    margin-bottom: 0.50rem;
    overflow: hidden;
    // box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    
    &:last-child {
        margin-bottom: 0;
    }
`;

export const SectionTitle = styled.h3`
    font-size: 0.75rem;
    font-weight: 500;
    color: #111827;
    padding: 0.20rem 0.70rem;
    margin: 0;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    background-color: #f9fafb;
    
    svg {
        margin-right: 0.5rem;
        color: #6b7280;
    }
`;

// Category styling
export const CategoryContainer = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
`;

export const Label = styled.label`
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    
    svg {
        margin-right: 0.375rem;
    }
`;

export const CatSelection = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    max-height: 180px;
    overflow-y: auto;
    padding: 0.25rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    background-color: #f9fafb;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #d1d5db;
        border-radius: 20px;
    }
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const Items = styled.div`
    padding: 0.5rem 0.75rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    color: #4b5563;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.15s ease;

    &:hover {
        border-color: oklch(27.8% 0.033 256.848);
        background-color: oklch(98.4% 0.003 247.858);
        color: oklch(27.8% 0.033 256.848);
    }
    
    &.selected {
        background-color: oklch(98.4% 0.003 247.858);
        border-color: oklch(27.8% 0.033 256.848);
        color: oklch(27.8% 0.033 256.848);
        font-weight: 500;
    }
    
    .check-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: oklch(27.8% 0.033 256.848);
    }
`;

export const CatsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    min-height: 40px;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    background-color: white;
`;

export const CategoryTag = styled.div`
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem 0.25rem 0.625rem;
    background-color: oklch(13% 0.028 261.692);
    color: white;
    border-radius: 120px;
    font-size: 0.75rem;
    font-weight: 400;
    
    button {
        background: none;
        border: none;
        display: inline-flex;
        align-items: center;
        color: white;
        margin-left: 0.25rem;
        padding: 0.125rem;
        cursor: pointer;
        
        &:hover {
            color: white;
        }
    }
`;

export const Clearicon = styled(ClearIcon)`
    font-size: 1rem !important;
`;

// Visibility options
export const VisibilityOption = styled.div`
    display: flex;
    align-items: center;
    padding: 0.25rem;
    border-radius: 0.75rem;
    border: 2px solid ${props => props.active ? props.activeColor : '#e5e7eb'};
    background-color: ${props => props.active ? props.activeBg : 'white'};
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        border-color: ${props => props.active ? props.activeColor : '#d1d5db'};
        background-color: ${props => props.active ? props.activeBg : '#f9fafb'};
    }
    
    .icon-wrapper {
        width: 2rem;
        height: 2rem;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        // background-color: ${props => props.active ? props.iconActiveBg : '#f3f4f6'};
        color: ${props => props.active ? props.iconActiveColor : '#6b7280'};
        flex-shrink: 0;
    }
    
    .content {
        margin-left: 0.75rem;
        flex: 1;
    }
    
    h3 {
        font-size: 0.75rem;
        font-weight: 600;
        margin: 0;
        color: ${props => props.active ? props.iconActiveColor : '#111827'};
    }
    
    p {
        font-size: 0.68rem;
        color: #6b7280;
        margin: 0 0 0 0;
    }
    
    input[type="radio"] {
        margin-left: 1rem;
        margin-right : 1rem;
    }
`;

// Image upload area
export const ImageUploadArea = styled.div`
    padding: 0.50rem;
    border: 1px dashed #d1d5db;
    border-radius: 0.375rem;
    background-color: #f9fafb;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s ease;
    margin: 0.50rem;

    &:hover {
        border-color: #9ca3af;
        background-color: #f3f4f6;
    }
    
    &.dragging {
        border-color: #60a5fa;
        background-color: #eff6ff;
    }
    
    svg {
        color: #9ca3af;
        font-size: 1.5rem;
        margin-bottom: 0.10rem;
    }
    
    .upload-text {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        font-size: 0.75rem;
        color: #4b5563;
        margin-bottom: 0.5rem;
        
        .browse {
            color: #2563eb;
            cursor: pointer;
            margin: 0 0.25rem;
            font-weight: 500;
            
            &:hover {
                text-decoration: underline;
            }
        }
    }
    
    .file-types {
        font-size: 0.75rem;
        color: #6b7280;
    }
    
    .image-preview {
        img {
            object-fit: cover;
            max-height: 200px;
        }
        
        .remove-image {
            display: inline-flex;
            align-items: center;
            background-color: #ef4444;
            color: white;
            border: none;
            padding: 0.75rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.8125rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.15s ease;
            
            svg {
                color: white;
                font-size: 0.75rem;
                margin: 0 0 0 0.375rem;
            }
            
            &:hover {
                background-color: #dc2626;
            }
        }
    }
`;

// URL slug input
export const SlugInputGroup = styled.div`
    display: flex;
    margin: 1rem;
    
    .prefix {
        display: inline-flex;
        align-items: center;
        background-color: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-right: none;
        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
        padding: 0 0.75rem;
        color: #6b7280;
        font-size: 0.75rem;
    }
    
    input {
        flex: 1;
        border: 1px solid #e5e7eb;
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
        padding: 0.625rem 0.75rem;
        font-size: 0.75rem;
        color: #111827;
        transition: all 0.15s ease;
        
        &:hover {
            border-color: #d1d5db;
        }
        
        &:focus {
            ${focusRingStyles}
            z-index: 10;
        }
    }
`;

export const HelpText = styled.p`
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0.375rem 0 0 1rem;
`;

// Don't think it's used anymore but keeping it
export const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 0.75rem;
    gap: 0.75rem;
`;

// Legacy components that are still used
export const Form = styled.form``;
export const AddPostIcon = styled(AddIcon)``;
export const ErrorMessageWrapper = styled.div``; 



