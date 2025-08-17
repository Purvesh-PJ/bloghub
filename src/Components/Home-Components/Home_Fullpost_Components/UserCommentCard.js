import { ParentContainer, CommentCardHeader, UserImage, UserName, UserPostCommentTime, MessageContainer, MessageBody, ButtonsContainer, ReplyIcon } from './UserCommentCard-Style';

import React, { useState } from 'react';

const UserCommentCard = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        setIsExpanded(!isExpanded);
      };

    return (
        <ParentContainer isExpanded={isExpanded} onClick={handleClick}>
            <CommentCardHeader>
                <UserImage src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png' />
                <UserName>
                    @GeekyQuantum
                </UserName>
                <UserPostCommentTime>
                    Mar 18 2018
                </UserPostCommentTime>
            </CommentCardHeader>

            <MessageContainer>
                <MessageBody>
                    Hello guys i am very interested in this topic i an thank you for creating this post because it is really helpful for me.Hello guys i am vety interested in this topic i an thank you for creating this post because it is really helpful for me.
                </MessageBody>
            </MessageContainer>

            <ButtonsContainer>
                <ReplyIcon />
            </ButtonsContainer>
        
        </ParentContainer>
    )
}

export default UserCommentCard;