import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";


export const Container = styled.div`
    width : 100%;
    min-width : fit-content;
    max-width : 200px;
    background-color : white;
    border-radius : 6px;
    color : #64748b;
    border : 2px solid #cbd5e1;
`;

export const SelectedValueContainer  = styled.div`
    display : flex;
    align-items : center;
    justify-content : space-between;
    padding : 8px;
    color : #334155;
    font-size : 12px;
    font-weight : 500;
    letter-spacing : 0.020rem;
    // border : 1px solid gray;
    gap : 10px;

    &:hover {
        cursor : pointer;
    }
`;

export const UnorderedList = styled.ul`
    padding: 0px;
    margin : 4px;
    box-sizing : border-box;
    font-size : 12px;
    font-weight : 500;
    letter-spacing : 0.020rem;
    // border : 1px solid gray;
`;

export const ListItem = styled.li`
    width : 100%;
    padding : 8px;
    list-style-type : none;
    box-sizing : border-box;
    text-align : left;
    // border : 1px solid gray;

    &:hover {
        cursor : pointer;
        background-color : #f1f5f9;
        color : #475569;
    }
`;

export const SelectedText = styled.span`
`;

export const DropIcon = styled(IoIosArrowDown)`
`;