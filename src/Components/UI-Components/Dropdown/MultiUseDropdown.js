import { useState } from 'react';
import { Container, DropdownHeader, Header, ListItemsContainer, ArrowIcon, DropdownOptions, ListItem, ProfileImage, ListDataWrapper, ListLabel, ListIcons, ArrowIconWrapper, ProfileImageWrapper } from './MultiUseDropdown-Style';
import defaultProfileImage from '../../../resources/images/default_Images/defaultProfileImage.jpg';

const MiltiUseDropdown = ({ 
        isProfile, 
        listData, 
        onSelect, 
        applyBorder, 
        dropContainerShadow, 
        dropContainerBorder, 
        listItemsColor, 
        forIcon,
        isOpen, 
        toggle 
    }) => {

    const [selectedOption, setSelectedOption ] = useState(null);
    const data = JSON.parse(localStorage.getItem('userData'));
    // console.log(data);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        onSelect(option);
    };

    return (
        
        <Container onClick={toggle} applyBorder={applyBorder}>
            <Header>
                {
                    isProfile ? ( 
                        <>
                            <ProfileImageWrapper>
                                <ProfileImage profile={isProfile} src={defaultProfileImage} /> 
                            </ProfileImageWrapper>
                            <DropdownHeader>
                                { data ? data?.user?.username : "Profile" }
                            </DropdownHeader>
                        </>
                    ) : (
                        <DropdownHeader>
                            { selectedOption ? selectedOption.label : "Select an option"}
                        </DropdownHeader>
                    )
                }
                <ArrowIconWrapper>
                    <ArrowIcon isOpen={isOpen}/>
                </ArrowIconWrapper>
            </Header>

         
            <ListItemsContainer>
                {
                    isOpen && (
                        <DropdownOptions dropContainerBorder={dropContainerBorder} dropContainerShadow={dropContainerShadow}>
                            {
                                listData && listData?.map((option) => (
                                    <ListItem key={option.value} onClick={() => handleOptionClick(option)}>
                                        <ListDataWrapper listItemsColor={listItemsColor}>
                                            <ListIcons forIcon={forIcon}>
                                                {option.icon}
                                            </ListIcons>
                                            <ListLabel>
                                                {option.label}
                                            </ListLabel>
                                        </ListDataWrapper>
                                    </ListItem>
                                ))
                            }
                        </DropdownOptions>
                    )
                }
            </ListItemsContainer>
        </Container>
    )
}

export default MiltiUseDropdown;