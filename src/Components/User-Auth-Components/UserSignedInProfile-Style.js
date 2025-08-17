import styled from 'styled-components';
import { RiArrowDropDownLine } from 'react-icons/ri'
import { AiFillSetting } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';


export const ParentContainer = styled.div`
    width : 200px;
    border-radius : 5.30rem;
    background-color : #F8F9F9;
    position: relative; 
    display: inline-block;
    padding : 5px;
    z-index : 100;
    background-color : white;
    border : 1px solid #E5E7E9;
`;

export const ChildContainerOne = styled.div`
    display : flex;
    flex-direction : row;
    justify-content : space-between;
    align-items : center;    
`;

export const ChildContainerTwo = styled.div`
    position: absolute;
    top : 48px;
    left : 10px;
    right : 10px;
    border-radius : 5px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    display : ${props => (props.isClicked ? 'block' : 'none')};
    z-index : 100;
`;

export const ListWrapper = styled.div`
    // border : 1px solid gray;
    padding : 3px; 
    background-color : white;
    border-radius : 5px;
    z-index : 100;
`;

export const ProfileImage = styled.img`
    width : 30px;
    height : 30px;
    border : 1px solid #E5E7E9;
    border-radius : 100%;
    background-color : #F8F9F9;
    object-fit: cover;  
`;

export const ProfileName = styled.p`
    font-size : 0.80rem;   
    margin: 0;
    padding: 0; 
    color : #5D6D7E;
`;

export const ArrowDropIcon = styled(RiArrowDropDownLine)`
    font-size : 25px;
    color : gray;
`;

export const List = styled.ul`
    list-style-type : none;
    padding: 0px; /* Reset padding */
    margin: 0px; /* Reset margin */
`;

export const ListItem = styled.li`
    display : flex;
    flex-direction : row;
    gap : 20px; 
    align-items : center;
    border-radius : 5px;
    // background-color : #EAEDED;
    padding-left   : 20px;

    &:hover {
        background-color : #D5D8DC;
        border-radius : 5px;

        // ${AiFillSetting} {
        //     color: #5DADE2; // Change the color of the icon on hover
        // }

        // ${BiLogOut} {
        //     color: #5DADE2; // Change the color of the icon on hover
        // }
    }
`;

export const SettingsIcon = styled(AiFillSetting )`
    color : #5D6D7E;
`;

export const LogoutIcon = styled(BiLogOut)`
    color : #5D6D7E;
`;

export const ListTypo = styled.p`
    color : #5D6D7E;
    font-size : 12px;
    user-select : none;
`;

export const DropOptionsButton = styled.button`
    width : 35px;
    height : 35px;
    display : flex;
    justify-content : center;
    align-items : center;
    background-color : #F2F3F4;
    border : none;
    border-radius : 5rem;
    color : black;

    &:hover {
        background-color : #EBF5FB;
        border-radius : 5rem;

        ${ArrowDropIcon} {
            color: #5DADE2; // Change the color of the icon on hover
        }
    }
`;

export const Divider = styled.hr`
    border-top : 1px solid #D6DBDF;
    margin-left : 1rem;
    margin-right : 1rem;
`;