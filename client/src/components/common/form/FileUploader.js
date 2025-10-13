import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FieldLabel, FieldError, Text, Flex } from '../../ui/primitives';
import styled from 'styled-components';

const DropZone = styled(Box)`
  border: 2px dashed ${(p) => p.theme.palette.divider};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: ${(p) => p.theme.spacing(6)};
  text-align: center;
  cursor: pointer;
  transition: all ${(p) => p.theme.motion.duration.normal} ${(p) => p.theme.motion.easing.standard};

  &:hover {
    border-color: ${(p) => p.theme.palette.primary.main};
    background: ${(p) => p.theme.palette.background.subtle};
  }

  &.drag-over {
    border-color: ${(p) => p.theme.palette.primary.main};
    background: ${(p) => p.theme.palette.background.subtle};
  }
`;

const FileList = styled(Box)`
  margin-top: ${(p) => p.theme.spacing(3)};
`;

const FileItem = styled(Flex)`
  padding: ${(p) => p.theme.spacing(2)};
  background: ${(p) => p.theme.palette.background.subtle};
  border-radius: ${(p) => p.theme.radii.md};
  margin-bottom: ${(p) => p.theme.spacing(2)};
`;

/**
 * FileUploader - A complete file upload component with drag & drop
 *
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.error - Error message to display
 * @param {boolean} props.required - Whether field is required
 * @param {Array} props.files - Array of selected files
 * @param {Function} props.onChange - Change handler (receives file array)
 * @param {boolean} props.multiple - Whether multiple files are allowed
 * @param {string} props.accept - Accepted file types
 * @param {number} props.maxSize - Maximum file size in bytes
 * @param {boolean} props.disabled - Whether uploader is disabled
 * @param {string} props.id - Uploader ID for accessibility
 * @param {string} props.dragText - Text shown in drag area
 * @param {string} props.buttonText - Text for upload button
 * @param {Object} props.containerProps - Props for container Box
 */
export const FileUploader = ({
  label,
  error,
  required = false,
  files = [],
  onChange,
  multiple = false,
  accept,
  maxSize,
  disabled = false,
  id,
  dragText = 'Drag and drop files here, or click to select',
  buttonText = 'Choose Files',
  containerProps = {},
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const uploaderId = id || `uploader-${Math.random().toString(36).substr(2, 9)}`;

  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);

    // Filter files by size if maxSize is specified
    const validFiles = maxSize ? fileArray.filter((file) => file.size <= maxSize) : fileArray;

    if (multiple) {
      onChange?.([...files, ...validFiles]);
    } else {
      onChange?.(validFiles.slice(0, 1));
    }
  };

  const handleInputChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles?.length > 0) {
      handleFileSelect(selectedFiles);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);

    if (!disabled) {
      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles?.length > 0) {
        handleFileSelect(droppedFiles);
      }
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box {...containerProps}>
      {label && (
        <FieldLabel htmlFor={uploaderId}>
          {label}
          {required && <span style={{ color: 'inherit', marginLeft: '4px' }}>*</span>}
        </FieldLabel>
      )}

      <input
        ref={fileInputRef}
        id={uploaderId}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        style={{ display: 'none' }}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${uploaderId}-error` : undefined}
      />

      <DropZone
        className={isDragOver ? 'drag-over' : ''}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        $opacity={disabled ? 0.6 : 1}
        $cursor={disabled ? 'not-allowed' : 'pointer'}
      >
        <Text $fontSize="lg" $color="secondary" style={{ marginBottom: '12px' }}>
          📁
        </Text>
        <Text $color="secondary" style={{ marginBottom: '16px' }}>
          {dragText}
        </Text>
        <Button
          $variant="ghost"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          {buttonText}
        </Button>
        {maxSize && (
          <Text $fontSize="sm" $color="muted" style={{ marginTop: '8px' }}>
            Maximum file size: {formatFileSize(maxSize)}
          </Text>
        )}
      </DropZone>

      {files.length > 0 && (
        <FileList>
          {files.map((file, index) => (
            <FileItem key={`${file.name}-${index}`} $align="center" $justify="space-between">
              <Box>
                <Text $fontSize="sm" $fontWeight="medium">
                  {file.name}
                </Text>
                <Text $fontSize="xs" $color="muted">
                  {formatFileSize(file.size)}
                </Text>
              </Box>
              <Button
                $variant="ghost"
                $size="sm"
                onClick={() => handleRemoveFile(index)}
                disabled={disabled}
              >
                ×
              </Button>
            </FileItem>
          ))}
        </FileList>
      )}

      {error && (
        <FieldError id={`${uploaderId}-error`} role="alert">
          {error}
        </FieldError>
      )}
    </Box>
  );
};

FileUploader.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  files: PropTypes.array,
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  dragText: PropTypes.string,
  buttonText: PropTypes.string,
  containerProps: PropTypes.object,
};
