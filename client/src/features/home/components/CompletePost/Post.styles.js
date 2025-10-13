import styled, { css } from 'styled-components';
import { ArrowBackIcon, ArrowForwardIcon, ShareIcon } from '../../../../shared/icons';
import { BsEyeFill } from 'react-icons/bs';
import { BiLike } from 'react-icons/bi';
import { MdReport } from 'react-icons/md';
import { fadeIn } from '../../../../components/common/theme/animations';
import { breakpoint } from '../../../../components/common/theme/breakpoints';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100px;
  gap: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.palette.background.surface};
  position: relative;
`;

export const Article = styled.article`
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: ${({ theme }) => theme.spacing(8)};
`;

export const ArticleBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  padding: 0;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(4)};
  position: relative;
`;

export const TitleAndTopicWrapper = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing(4)} 0;
  font-size: ${({ theme }) => theme.typography.size.h1};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.palette.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  ${breakpoint.down('tablet')} {
    font-size: ${({ theme }) => theme.typography.size.h2};
  }
`;

// Add the missing PostMeta and related components
export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
`;

export const MetaDot = styled.span`
  height: 3px;
  width: 3px;
  background-color: ${({ theme }) => theme.palette.grey[400]};
  border-radius: ${({ theme }) => theme.radii.full};
  margin: 0 ${({ theme }) => theme.spacing(2)};
`;

// Add text sizing controls
export const TextOptionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  margin-bottom: 8px;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const FontSizeControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FontButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: white;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #f1f5f9;
    color: #0f172a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 16px;
  }
`;

export const PrintButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #475569;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }

  svg {
    font-size: 14px;
  }
`;

// Add floating share button
export const FloatingShareContainer = styled.button`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-4px);
  }

  svg {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    bottom: 80px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
`;

export const Content = styled.div`
  font-size: 1.125rem;
  line-height: 1.6;
  color: #334155;

  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  /* Fix consecutive paragraphs having too much space */
  p + p {
    margin-top: 0.75rem;
  }

  h2 {
    font-size: 1.5rem;
    margin: 1.5rem 0 1rem;
    font-weight: 600;
    color: #1e293b;
  }

  h3 {
    font-size: 1.25rem;
    margin: 1.25rem 0 0.75rem;
    font-weight: 600;
    color: #1e293b;
  }

  /* Adjust heading spacing when following another element */
  p + h2,
  p + h3 {
    margin-top: 1.5rem;
  }

  ul,
  ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  /* Fix spacing for lists */
  li p {
    margin-bottom: 0.5rem;
  }

  a {
    color: #2563eb;
    text-decoration: none;
    border-bottom: 1px solid #2563eb;

    &:hover {
      color: #1d4ed8;
    }
  }

  blockquote {
    border-left: 4px solid #e2e8f0;
    padding-left: 1rem;
    font-style: italic;
    color: #64748b;
    margin: 1rem 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  pre {
    background-color: #f8fafc;
    border-radius: 0.5rem;
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  code {
    font-family: monospace;
    background-color: #f1f5f9;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  /* Fix for divs that might be inserted by the editor */
  div {
    margin-bottom: 0.75rem;
  }

  /* Preserve whitespace in pre-formatted text */
  pre {
    white-space: pre-wrap;
  }

  /* Ensure spacing consistency between different elements */
  h2 + p,
  h3 + p,
  blockquote + p,
  pre + p,
  ul + p,
  ol + p {
    margin-top: 0.5rem;
  }

  /* Handle empty paragraphs that might be used for spacing */
  p:empty {
    margin: 0;
    height: 0.5rem;
  }

  /* Fix spacing when ReactHtmlParser creates wrapper divs */
  & > div > p:first-child {
    margin-top: 0;
  }

  & > div > p:last-child {
    margin-bottom: 0;
  }

  .spacer-paragraph {
    margin: 0.5rem 0;
    height: 0.75rem;
  }
`;

export const ButtonShare = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: none;
  background-color: #1e293b;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const IconShare = styled(ShareIcon)``;

export const CoverImage = styled.div`
  width: 100%;
  height: 450px;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    height: 300px;
  }
`;

export const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #e2e8f0;
  margin: 8px 0;
`;

export const PostFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

export const LikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background-color: transparent;
  color: ${(props) => (props.liked ? '#2563eb' : '#64748b')};
  font-size: 0.9375rem;
  padding: 8px 16px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
  }

  svg {
    font-size: 1.25rem;
    ${(props) =>
      props.liked &&
      css`
        fill: #2563eb;
      `}
  }
`;

export const ViewWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.9375rem;
  padding: 8px 16px;
`;

export const ViewIcon = styled(BsEyeFill)`
  font-size: 1.25rem;
`;

export const LikeIcon = styled(BiLike)`
  font-size: 1.25rem;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

export const Tag = styled.span`
  background-color: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 9999px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e2e8f0;
    color: #334155;
  }
`;

export const ShareOptions = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  display: flex;
  gap: 8px;
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
`;

export const SocialButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border: none;
  background-color: ${(props) => props.color || '#1e293b'};
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 16px;
  }
`;

export const PostNavigationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.25rem;
  margin-left: auto;
  margin-right: auto;
  width: 23%;
`;

export const CommentsWrapper = styled.div``;

export const StyledQuillEditor = styled.div`
  .ql-container {
    background-color: #ffffff;
    border: none;
  }
  .ql-editor {
    padding: 0;
  }
`;

export const SharePromptWrapper = styled.div`
  margin: auto;
`;

export const Button = styled.button`
  border: none;
  margin: 10px;
  width: 100px;
  color: gray;
  background-color: none;
  border-radius: 0.25rem;

  &:hover {
    background-color: #f0ffff;
  }
`;

export const PrevButton = styled(Button)`
  padding: 0.5rem;
`;

export const NextButton = styled(Button)`
  padding: 0.5rem;
`;

export const ReportSection = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8f9f9;
  height: 30px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
`;

export const PostFooterSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 50px;
`;

export const ReportArticleIcon = styled(MdReport)``;

export const IconArrowBack = styled(ArrowBackIcon)``;

export const IconArrowForward = styled(ArrowForwardIcon)``;
