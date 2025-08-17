import styled from 'styled-components';
import { RiArrowDownSLine } from 'react-icons/ri';

export const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction : column;
    padding : 2px;
    width : 170px;
    // box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    border-radius : 5px;
    background-color : white;
    color : gray;
    cursor : pointer;
    border-radius : 2rem;
    border : ${(props) => props.applyBorder ? '2px solid #D6DBDF' : 'none'};
    background-color : ${(props) => props.profileBgColor || 'none'}
`;

export const Header = styled.div`
    display: flex;
    flex-direction : row;
    justify-content : space-around;
`;

export const ListItemsContainer = styled.div`
`;

export const DropdownHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap : 10px;
    // border : 1px solid gray;
    padding-left : 4px;
    padding-right : 4px;
    // cursor: pointer;
    border-radius: 4px;
    user-select : none;
    font-size : 14px;
`;

export const ArrowIcon = styled(RiArrowDownSLine)`
    transition : transform 0.3s ease;
    font-size : 20px;
    transform : ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

export const DropdownOptions = styled.ul`
    position: absolute;
    padding: 0;
    // margin-top: 10rem;
    top: 100%;
    left : 0;
    right : 0;
    list-style-type: none;
    border-radius: 5px;
    background-color: white;
    z-index: 1;
    user-select : none;
    // border : 1px solid gray;
    // margin-top : 1rem;
    box-shadow : ${(props) => props.dropContainerShadow ? 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' : '' }; 
    border : ${(props) => props.dropContainerBorder ? '1px solid #D6DBDF' : '' };
    max-height: 200px;
`;

export const ListItem = styled.li`
    padding : 8px;
    &:hover {
        background-color: #f0f0f0;
        cursor: pointer;
    }
`;

export const ProfileImage = styled.img`
    width : 32px;
    height : 32px;
    border-radius : 50%;
    object-fit : cover;
    // border : 3px solid #BEDFFF;
    ${(props) => (props.profile ? 'block' : 'hidden')}
`;

export const ListDataWrapper = styled.div`
    display : flex;
    flex-direction : row;
    // border : 1px solid gray;
    // justify-content : left;
    align-items : center;
    width : 150px;
    // gap : 10px;
    // margin-left : auto;
    // margin-right : auto;
    // height : 20px;
    font-size : 12px;
    color : ${(props) => props.listItemsColor || 'gray'};
`;

export const ListLabel = styled.div`
    display : flex;
    // justify-content : center;
    // align-items : center;
    // border : 1px solid gray;
    height : 100%;
    // width : 100%;
`;

export const ListIcons = styled.div`
    display : ${(props) => props.forIcon ? 'flex' : 'none'} ;
    justify-content : center;
    align-items : center;
    // border : 1px solid gray;
    height : 100%;
    width : 30px;
`;

export const ArrowIconWrapper = styled.div`
    display : flex;
    align-items : center;
`;

export const ProfileImageWrapper = styled.div`
    display : flex;
    align-items : center;
`;