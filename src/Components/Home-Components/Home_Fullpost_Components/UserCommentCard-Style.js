import styled, {css} from 'styled-components';
import { GoReply } from 'react-icons/go';

export const ParentContainer = styled.div`
    // border : 1px solid gray;
    max-height : 65px;
    display: flex;
    flex-direction: column;
    overflow : hidden;
    // text-overflow : ellipsis;
    // flex-wrap : normal;
    cursor: pointer;

    &:hover {
        background-color : #F4F6F6;
        border-radius : 8px;
    }

    ${(props) => props.isExpanded && 
        css` max-height : 100%;`
    }
`;

export const CommentCardHeader = styled.div`
    // border : 1px solid gray;
    display : flex;
    flex-direction : row;
    align-items : center;
    justify-content: space-between;
    color : gray;
`;

export const UserImage = styled.img`
    width : 32px;
    height : 32px;
    border-radius : 50%;
    // background-color : gray;
    margin-right : 10px;
    object-fit : cover;
`;

export const UserName = styled.span`
    font-size : 14px;
    color : #2C3E50;
    &:hover {
        text-decoration : underlined;
    }
`;

export const UserPostCommentTime = styled.span`
    font-size : 0.60rem;
    margin-left : auto;
    margin-right : 8px;
`;

export const DivTime = styled.div`
`;

export const MessageContainer = styled.div`
    // border : 1px solid gray;
    // max-height : 100%;
`;

export const MessageBody = styled.p`
    // border : 1px solid gray;
    font-size : 11px;
    width : 82%;
    color : #212F3D; 
    margin-left  : auto;
    margin-right : 8px;
    margin-top : 0;
    margin-bottom : 0;
    padding : 0; 
`;

export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
    margin : 5px;
`;

export const ReplyIcon = styled(GoReply)`
    color : #273746;
`;