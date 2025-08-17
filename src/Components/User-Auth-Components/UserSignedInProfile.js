import { ParentContainer, ChildContainerOne, ChildContainerTwo, ListWrapper, ProfileImage, ProfileName, DropOptionsButton, ArrowDropIcon, List, ListItem, SettingsIcon, LogoutIcon, ListTypo, Divider } from './UserSignedInProfile-Style';
import { useState } from 'react';

const UserSignedInProfile = ({ logout, user }) => {

    const [click, setClick] = useState(false);

    const handleClick = () => {
        setClick(!click);
    }

    return (
        <>
            <ParentContainer>

                <ChildContainerOne>

                    <ProfileImage src={'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFpJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'} alt="profile image"/>

                    <ProfileName>
                        {
                            user ? user.username : 'profileName'
                        }
                    </ProfileName>

                    <DropOptionsButton onClick={() => handleClick()} > 
                        <ArrowDropIcon/>
                    </DropOptionsButton>

                </ChildContainerOne>

                {
                    click && (
                        <ChildContainerTwo isClicked={click}>
                            <ListWrapper>
                                <List>
                                    <ListItem>
                                        <SettingsIcon/>
                                        <ListTypo>
                                            Settings
                                        </ListTypo>
                                    </ListItem>
                                    <Divider />
                                    <ListItem onClick={logout}>
                                        <LogoutIcon/>
                                        <ListTypo>
                                            logout
                                        </ListTypo>
                                    </ListItem>
                                </List>
                            </ListWrapper>
                        </ChildContainerTwo>
                    )
                }     
            </ParentContainer>
        </>
    )
};

export default UserSignedInProfile;