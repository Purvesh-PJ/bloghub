import styled from "styled-components";

export const Form = styled.div`
    display : flex;
    flex-direction : column;
    // padding : 1rem;
    // background-color : #f8fafc;
    gap : 10px;
    border-radius : 10px;
`;

export const FormHeading = styled.h2`
    font-size : ${({ theme }) => theme.typography.fontSizeMedium};
    font-weight : 400;
    color : #475569;
    margin : 0;
    padding : 0;
    font-weight : 600;
`;

export const Divider = styled.hr`
    margin : 0.4%;
`;