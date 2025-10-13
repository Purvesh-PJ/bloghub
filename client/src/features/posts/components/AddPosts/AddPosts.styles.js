import styled, { keyframes, css } from 'styled-components';
import { AddIcon, ClearIcon } from '../../../../shared/icons';
import ReactQuill from 'react-quill';
import { fadeIn, slideIn, spin } from '../../../../components/common/theme/animations';

// Custom pulse animation for this component (box-shadow based)
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
    border-color: ${({ theme }) => theme.palette.primary.main};
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
  background-color: ${({ theme }) => theme.palette.background.default};
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
  background-color: ${({ theme }) => theme.palette.background.surface};
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

export const FormHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

  h1 {
    font-size: 0.75rem;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.primary};
    margin: 0;
  }

  .saving-indicator,
  .saved-indicator {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.palette.text.secondary};

    svg {
      margin-right: 0.5rem;
    }
  }

  .saving-indicator {
    color: ${({ theme }) => theme.palette.text.muted};
  }

  .saved-indicator {
    color: ${({ theme }) => theme.palette.success.main};
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
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.palette.background.surface};
  border-left: 1px solid ${({ theme }) => theme.palette.divider};

  @media (max-width: 1024px) {
    width: 100%;
    border-left: none;
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  .visibility-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }

  .selected-cats {
    margin-top: 1rem;
  }

  .no-categories {
    color: ${({ theme }) => theme.palette.text.muted};
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
    padding: 0.6rem;
    font-size: 0.75rem;
    border: 2px solid ${({ theme }) => theme.palette.divider};
    border-radius: 0.375rem;
    margin-top: 0.375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.primary};
    transition: border-color 0.15s ease;

    &::placeholder {
      color: ${({ theme }) => theme.palette.grey[400]};
      font-weight: 400;
    }

    &:hover {
      border-color: ${({ theme }) => theme.palette.grey[300]};
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
  border-top: 1px solid ${({ theme }) => theme.palette.divider};
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

    .icon,
    .spinner {
      margin-right: 0.5rem;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .cancel-button {
    background: ${({ theme }) => theme.palette.background.surface};
    color: ${({ theme }) => theme.palette.text.secondary};
    border: 1px solid ${({ theme }) => theme.palette.grey[300]};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.palette.background.subtle};
      border-color: ${({ theme }) => theme.palette.grey[400]};
    }

    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.palette.grey[100]};
    }
  }

  .submit-button {
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};
    border: none;
    padding: 0.6875rem 1.5rem;

    .spinner {
      animation: ${spin} 1s linear infinite;
    }

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.palette.primary.dark};
    }

    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.palette.primary.dark};
    }
  }
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.palette.success.light};
  color: ${({ theme }) => theme.palette.success.dark};
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
  background-color: ${({ theme }) => theme.palette.background.surface};
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
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    padding: 0.25rem;
    // background-color: #f9fafb;
  }

  .ql-editor {
    min-height: 300px;
    padding: 1rem 1.25rem;

    &.ql-blank::before {
      font-style: normal;
      color: ${({ theme }) => theme.palette.grey[400]};
    }
  }

  .ql-toolbar button {
    margin: 4px;
    &:hover {
      color: ${({ theme }) => theme.palette.primary.main};
    }

    &.ql-active {
      color: ${({ theme }) => theme.palette.primary.dark};
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
    color: ${({ theme }) => theme.palette.primary.main};
  }

  span {
    margin-top: 1rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.palette.error.light};
  color: ${({ theme }) => theme.palette.error.dark};

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
    color: ${({ theme }) => theme.palette.error.dark};
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: ${({ theme }) => theme.palette.error.dark};
    }
  }
`;

// Section styling
export const Section = styled.section`
  background-color: ${({ theme }) => theme.palette.background.subtle};
  border-radius: 0.5rem;
  // border: 1px solid #e5e7eb;
  margin-bottom: 0.5rem;
  overflow: hidden;
  // box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.text.primary};
  padding: 0.2rem 0.7rem;
  margin: 0;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.background.subtle};

  svg {
    margin-right: 0.5rem;
    color: ${({ theme }) => theme.palette.text.muted};
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
  color: ${({ theme }) => theme.palette.text.secondary};
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
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 0.375rem;
  background-color: ${({ theme }) => theme.palette.background.subtle};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.palette.grey[300]};
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Items = styled.div`
  padding: 0.5rem 0.75rem;
  background-color: ${({ theme }) => theme.palette.background.surface};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.palette.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.palette.primary.main};
    background-color: ${({ theme }) => theme.palette.background.subtle};
    color: ${({ theme }) => theme.palette.primary.main};
  }

  &.selected {
    background-color: ${({ theme }) => theme.palette.background.subtle};
    border-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.main};
    font-weight: 500;
  }

  .check-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const CatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 40px;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 0.375rem;
  background-color: ${({ theme }) => theme.palette.background.surface};
`;

export const CategoryTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem 0.25rem 0.625rem;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  color: ${({ theme }) => theme.palette.secondary.contrastText};
  border-radius: 120px;
  font-size: 0.75rem;
  font-weight: 400;

  button {
    background: none;
    border: none;
    display: inline-flex;
    align-items: center;
    color: ${({ theme }) => theme.palette.secondary.contrastText};
    margin-left: 0.25rem;
    padding: 0.125rem;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.palette.secondary.contrastText};
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
  border: 2px solid ${(p) => (p.$active ? p.theme.palette.primary.main : p.theme.palette.divider)};
  background-color: ${(p) =>
    p.$active
      ? `color-mix(in srgb, ${p.theme.palette.primary.main} 12%, transparent)`
      : p.theme.palette.background.surface};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${(p) => (p.$active ? p.theme.palette.primary.main : p.theme.palette.grey[300])};
    background-color: ${(p) =>
      p.$active
        ? `color-mix(in srgb, ${p.theme.palette.primary.main} 14%, transparent)`
        : p.theme.palette.background.subtle};
  }

  .icon-wrapper {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(p) => (p.$active ? p.theme.palette.primary.main : p.theme.palette.text.muted)};
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
    color: ${(p) => (p.$active ? p.theme.palette.primary.main : p.theme.palette.text.primary)};
  }

  p {
    font-size: 0.68rem;
    color: ${({ theme }) => theme.palette.text.muted};
    margin: 0 0 0 0;
  }

  input[type='radio'] {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

// Image upload area
export const ImageUploadArea = styled.div`
  padding: 0.5rem;
  border: 1px dashed ${({ theme }) => theme.palette.grey[300]};
  border-radius: 0.375rem;
  background-color: ${({ theme }) => theme.palette.background.subtle};
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
  margin: 0.5rem;

  &:hover {
    border-color: ${({ theme }) => theme.palette.grey[400]};
    background-color: ${({ theme }) => theme.palette.grey[100]};
  }

  &.dragging {
    border-color: ${({ theme }) => theme.palette.primary.light};
    background-color: ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)'};
  }

  svg {
    color: ${({ theme }) => theme.palette.grey[400]};
    font-size: 1.5rem;
    margin-bottom: 0.1rem;
  }

  .upload-text {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin-bottom: 0.5rem;

    .browse {
      color: ${({ theme }) => theme.palette.primary.dark};
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
    color: ${({ theme }) => theme.palette.text.muted};
  }

  .image-preview {
    img {
      object-fit: cover;
      max-height: 200px;
      max-width: 100%;
      margin-bottom: ${(p) => p.theme.spacing(2)};
    }

    .remove-image {
      display: inline-flex;
      align-items: center;
      background-color: ${({ theme }) => theme.palette.error.main};
      color: ${({ theme }) => theme.palette.error.contrastText};
      border: none;
      padding: 0.75rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.15s ease;

      svg {
        color: ${({ theme }) => theme.palette.error.contrastText};
        font-size: 0.75rem;
        margin: 0 0 0 0.375rem;
      }

      &:hover {
        background-color: ${({ theme }) => theme.palette.error.dark};
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
    background-color: ${({ theme }) => theme.palette.background.subtle};
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-right: none;
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
    padding: 0 0.75rem;
    color: ${({ theme }) => theme.palette.text.muted};
    font-size: 0.75rem;
  }

  input {
    flex: 1;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.palette.text.primary};
    transition: all 0.15s ease;

    &:hover {
      border-color: ${({ theme }) => theme.palette.grey[300]};
    }

    &:focus {
      ${focusRingStyles}
      z-index: 10;
    }
  }
`;

export const HelpText = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.palette.text.muted};
  margin: 0.375rem 0 0 1rem;
`;

export const HelpLink = styled.span`
  color: ${(p) => p.theme.palette.primary.main};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const HiddenFileInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

export const LabelTop = styled(Label)`
  margin-top: 1rem;
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
