import React from 'react';
import { Container, ListItemContainer, LinkLocation, Icon, ItemName, Heading } from './SettingsSideNavigationPanel-Style';
import { useLocation } from 'react-router-dom';

const SettingsSideNavigationPanel = ({ SettingsPanelData }) => {
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname.includes(path);
    };

    return (
        <Container>
            <Heading>
                {SettingsPanelData.PanelHeading.heading}
            </Heading>
            
            {SettingsPanelData.Settings.map((data, index) => (
                <ListItemContainer key={index}>
                    <LinkLocation 
                        to={`${data.location}`}
                        className={isActive(data.location) ? 'active' : ''}
                    >
                        <Icon>
                            {data.icon}
                        </Icon>
                        <ItemName>
                            {data.itemName}
                        </ItemName>
                    </LinkLocation>
                </ListItemContainer>
            ))}
        </Container>
    );
};

export default SettingsSideNavigationPanel;


