import 'react-quill/dist/quill.snow.css';
export const ReactQuillToolbarOptions = [
  // [{ 'undo': true, 'redo': true }]

  [{ header: [1, 2, 3, 4, 5, 6, false] }], // Header size

  [{ font: [] }], // Font family

  ['bold', 'italic', 'underline', 'strike'], // Basic formatting

  [{ color: [] }, { background: [] }], // Text and background color

  [{ list: 'ordered' }, { list: 'bullet' }], // Lists

  [{ align: [] }], // Text alignment

  [{ indent: '-1' }, { indent: '+1' }], // Indentation

  ['blockquote', 'code-block'], // Blockquote and code block

  [{ script: 'sub' }, { script: 'super' }], // Subscript and superscript

  [{ direction: 'rtl' }], // Text direction

  [{ size: ['small', false, 'large', 'huge'] }], // Font size

  ['link', 'image', 'video'], // Links, images, and videos

  ['clean'], // Clear formatting
];

export const OptionsForPostCommentPrompt = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link'],
  ['clean'],
];
