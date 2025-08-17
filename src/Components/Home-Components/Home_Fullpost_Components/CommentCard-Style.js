import styled, { css, keyframes } from "styled-components";
import { RiArrowDownSLine } from "react-icons/ri";
import { BsFillReplyFill } from "react-icons/bs";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const Container = styled.div`
    position: relative;
    padding-left: ${props => props.nestingLevel > 0 ? `${props.nestingLevel * 20}px` : '0'};
    margin-left: ${props => props.nestingLevel > 0 ? '20px' : '0'};
    border-left: ${props => props.nestingLevel > 0 ? '2px solid #f1f5f9' : 'none'};
    display: flex;
    flex-direction: column;
    animation: ${fadeIn} 0.3s ease-out;
    
    @media (max-width: 640px) {
        padding-left: ${props => props.nestingLevel > 0 ? `${props.nestingLevel * 10}px` : '0'};
        margin-left: ${props => props.nestingLevel > 0 ? '10px' : '0'};
    }
`;

export const Comment = styled.div`
    display: flex;
    gap: 12px;
    position: relative;
    padding: 16px;
    border-radius: 12px;
    background-color: white;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: #f8fafc;
    }
    
    @media (max-width: 640px) {
        gap: 8px;
        padding: 12px;
    }
`;

export const ReplyComment = styled.div`
    margin-top: 8px;
`;

export const CommentHeader = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const CommentMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    @media (max-width: 640px) {
        flex-direction: column;
        gap: 4px;
    }
`;

export const ProfileNameContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Username = styled.span`
    font-weight: 600;
    font-size: 0.9375rem;
    color: ${props => props.isAuthorComment ? '#2563eb' : '#334155'};
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const UserBadge = styled.span`
    font-size: 0.6875rem;
    font-weight: 500;
    padding: 2px 6px;
    border-radius: 4px;
    background-color: ${props => props.isAuthor ? '#dbeafe' : '#f1f5f9'};
    color: ${props => props.isAuthor ? '#2563eb' : '#64748b'};
`;

export const RepliedToUseContainer = styled.div``;

export const RepliedToUsername = styled.span`
    font-size: 0.75rem;
    color: #64748b;
    
    span {
        color: #2563eb;
        font-weight: 500;
    }
`;

export const Imagecont = styled.div`
    position: relative;
`;

export const AvatarStatus = styled.div`
    position: absolute;
    bottom: -4px;
    right: -4px;
    background-color: #2563eb;
    color: white;
    font-size: 0.5625rem;
    padding: 2px 4px;
    border-radius: 4px;
    font-weight: 600;
    z-index: 1;
`;

export const Image = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const Status = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const TimeStamp = styled.span`
    font-size: 0.75rem;
    color: #94a3b8;
`;

export const RepliesCount = styled.span`
    font-size: 0.75rem;
    color: #64748b;
    display: ${props => props.visible ? 'inline' : 'none'};
`;

export const Paragraph = styled.p`
    position: relative;
    padding: 2px 2px 16px 2px;
    margin: 0;
    margin-left: 0;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: #334155;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${(props) => (props.isExtended && props.isExpandable) ? '3' : 'none'};
    cursor: ${props => props.isExpandable ? 'pointer' : 'auto'};
`;

export const Extendericon = styled(RiArrowDownSLine)`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    padding: 4px;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    transform: ${(props) => props.isExtended ? 'rotate(0deg)' : 'rotate(180deg)'};
`;

export const CommentActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
`;

export const CommentVoting = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border-radius: 9999px;
    background-color: #f1f5f9;
`;

export const VoteButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border: none;
    background-color: transparent;
    color: ${props => props.active ? (props.direction === 'up' ? '#2563eb' : '#ef4444') : '#64748b'};
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: ${props => props.direction === 'up' ? '#dbeafe' : '#fee2e2'};
    }
`;

export const VoteCount = styled.span`
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 16px;
    text-align: center;
    color: ${props => 
        props.positive ? '#2563eb' : 
        props.negative ? '#ef4444' : 
        '#64748b'
    };
`;

export const ButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
`;

export const ReplyIcon = styled(BsFillReplyFill)`
    font-size: 1rem;
`;

export const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: ${props => props.active ? '#dbeafe' : 'transparent'};
    color: ${props => props.active ? '#2563eb' : '#64748b'};
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f1f5f9;
    }
    
    svg {
        font-size: 0.875rem;
    }
`;

export const ReplyToggleButton = styled.button`
    background-color: ${props => props.active ? '#dbeafe' : 'transparent'};
    color: ${props => props.active ? '#2563eb' : '#64748b'};
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f1f5f9;
    }
`;

export const MenuButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border: none;
    background-color: transparent;
    color: #64748b;
    border-radius: 50%;
    cursor: pointer;
    
    &:hover {
        background-color: #f1f5f9;
    }
`;

export const MenuDropdown = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 10;
    width: 150px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    animation: ${fadeIn} 0.2s ease-out;
`;

export const MenuOption = styled.button`
    width: 100%;
    text-align: left;
    padding: 8px 12px;
    background-color: transparent;
    border: none;
    color: ${props => props.isDelete ? '#ef4444' : '#334155'};
    font-size: 0.875rem;
    cursor: pointer;
    
    &:hover {
        background-color: ${props => props.isDelete ? '#fee2e2' : '#f1f5f9'};
    }
    
    &:first-child {
        border-radius: 8px 8px 0 0;
    }
    
    &:last-child {
        border-radius: 0 0 8px 8px;
    }
`;

export const CommentReplyForm = styled.div`
    margin: 8px 0 8px 52px;
    display: ${props => props.visible ? 'block' : 'none'};
    animation: ${fadeIn} 0.3s ease-out;
`;

export const CommentReplyHolder = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .button-group {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
    }
`;

export const Textarea = styled.textarea`
    outline: none;
    border: 1px solid #e2e8f0;
    padding: 12px;
    font-size: 0.875rem;
    color: #334155;
    border-radius: 8px;
    resize: vertical;
    min-height: 100px;
    
    &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    
    &::placeholder {
        color: #94a3b8;
    }
`;

export const CharLimit = styled.div`
    text-align: right;
    font-size: 0.75rem;
    color: ${props => props.isNearLimit ? '#ef4444' : '#94a3b8'};
`;

export const CancelButton = styled.button`
    padding: 8px 16px;
    background-color: white;
    border: 1px solid #e2e8f0;
    color: #64748b;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f1f5f9;
    }
`;

export const RepliesContainer = styled.div`
    margin-top: 16px;
    padding: 12px;
    background-color: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
`;

export const RepliesHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
        font-size: 0.875rem;
        color: #64748b;
    }
    
    a {
        color: #2563eb;
        font-size: 0.875rem;
        text-decoration: none;
        
        &:hover {
            text-decoration: underline;
        }
    }
`;

export const EmojiSelector = styled.div`
    position: absolute;
    top: -40px;
    left: 30px;
    display: flex;
    gap: 4px;
    background-color: white;
    padding: 6px;
    border-radius: 9999px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 5;
    animation: ${fadeIn} 0.2s ease-out;
`;

export const EmojiButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${props => props.small ? '22px' : '28px'};
    height: ${props => props.small ? '22px' : '28px'};
    border: none;
    background-color: ${props => props.color || 'transparent'};
    color: ${props => props.small ? '#64748b' : '#64748b'};
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    
    &:hover {
        background-color: #f1f5f9;
        transform: scale(1.1);
    }
    
    ${props => props.count && css`
        &::after {
            content: "${props.count}";
            position: absolute;
            top: -8px;
            right: -8px;
            font-size: 0.6875rem;
            background-color: #e2e8f0;
            color: #475569;
            border-radius: 9999px;
            padding: 1px 4px;
            font-weight: 600;
        }
    `}
`;

export const ReactionBar = styled.div`
    display: ${props => props.visible ? 'flex' : 'none'};
    gap: 4px;
    margin-top: 4px;
    padding: 4px 8px;
    border-radius: 9999px;
    background-color: #f1f5f9;
    width: fit-content;
`;

export const EditMenu = styled.div`
    position: relative;
`;

