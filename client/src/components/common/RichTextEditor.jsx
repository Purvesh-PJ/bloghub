import { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Code, Link, Image } from 'lucide-react';

const EditorContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.inputBorderFocus};
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputBorder};
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ $active, theme }) => $active ? theme.colors.bgActive : 'transparent'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  
  svg { width: 16px; height: 16px; }
`;

const ToolbarDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 4px;
  align-self: center;
`;

const EditorArea = styled.div`
  min-height: 300px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.inputBg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  
  &:empty:before {
    content: attr(data-placeholder);
    color: ${({ theme }) => theme.colors.inputPlaceholder};
  }
  
  h1, h2, h3 {
    margin: 0.5em 0;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }
  
  h1 { font-size: 1.5em; }
  h2 { font-size: 1.25em; }
  h3 { font-size: 1.1em; }
  
  p { margin: 0.5em 0; }
  
  ul, ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }
  
  blockquote {
    margin: 0.5em 0;
    padding-left: 1em;
    border-left: 3px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  pre, code {
    background: ${({ theme }) => theme.colors.codeBg};
    border-radius: ${({ theme }) => theme.radii.sm};
    font-family: monospace;
  }
  
  pre {
    padding: 1em;
    overflow-x: auto;
  }
  
  code {
    padding: 0.2em 0.4em;
  }
  
  a {
    color: ${({ theme }) => theme.colors.textLink};
    text-decoration: underline;
  }
  
  img {
    max-width: 100%;
    border-radius: ${({ theme }) => theme.radii.md};
  }
`;

export function RichTextEditor({ value, onChange, placeholder = 'Write your content...' }) {
  const editorRef = useRef(null);

  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    // Trigger onChange with updated content
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  const insertImage = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  }, [execCommand]);

  return (
    <EditorContainer>
      <Toolbar>
        <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
          <Bold />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
          <Italic />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
          <Underline />
        </ToolbarButton>
        
        <ToolbarDivider />
        
        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          <List />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          <ListOrdered />
        </ToolbarButton>
        
        <ToolbarDivider />
        
        <ToolbarButton onClick={() => execCommand('formatBlock', 'blockquote')} title="Quote">
          <Quote />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('formatBlock', 'pre')} title="Code Block">
          <Code />
        </ToolbarButton>
        
        <ToolbarDivider />
        
        <ToolbarButton onClick={insertLink} title="Insert Link">
          <Link />
        </ToolbarButton>
        <ToolbarButton onClick={insertImage} title="Insert Image">
          <Image />
        </ToolbarButton>
      </Toolbar>
      
      <EditorArea
        ref={editorRef}
        contentEditable
        data-placeholder={placeholder}
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </EditorContainer>
  );
}
