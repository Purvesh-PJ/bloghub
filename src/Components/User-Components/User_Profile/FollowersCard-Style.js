import styled from "styled-components";

export const Container = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    position : relative;
    // border : 1px solid #e2e8f0;
    border-radius : 12px;
    width : 25%;
    max-width : 360px;
    max-height : 100px;
    padding : 16px;
    background-color : white;   
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    // height : 100px;
`;

export const CardTitle = styled.h3`
    font-size: 1rem;
    margin-bottom: 0.5rem;
    // border : 1px solid gray;
    margin : 0;
`;

export const Small = styled.small`
`;