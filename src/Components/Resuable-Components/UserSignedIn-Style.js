import styled from 'styled-components';

export const Container = styled.div`
    position: relative;
    // display: inline-block;
    // border : 1px solid gray;
`;

export const ProfileImage = styled.img`
    display : flex;
    justify-content : center;
    align-items : center;
    font-size: 24px;
    cursor: pointer;
    border-radius : 50%;
    width : 32px;
    height : 32px;
    margin-left : auto;
    transition : box-shadow 0.2s ease, transform 0.2s ease;
   
    ${(props) => props.isOpen && 'box-shadow: #cbd5e1 0px 0px 0px 3px;'}

    &:hover {
        box-shadow: #cbd5e1 0px 0px 0px 3px;
    }
`;

export const DropdownMenu = styled.div`
    position: absolute;
    right: 0;
    top: 50px;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    // border-radius: 4px;
    z-index: 1000;
    // border : 1px solid gray;
    border-radius : 8px;
    color : #334155;
    padding : 8px;
`;

export const DropdownItem = styled.div`
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap : 10px;
    cursor: pointer;
    // border : 1px solid gray;
    font-size : 14px;
    transition : background-color 0.2s ease;
    &:hover {
        background-color: #f0f0f0;
        border-radius : 6px;
    }
    & > svg {
        margin-right: 8px;
    }
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
    display : flex;
    justify-content : center;
    align-items : center;
    // border : 1px solid gray;
    height : 100%;
`;
