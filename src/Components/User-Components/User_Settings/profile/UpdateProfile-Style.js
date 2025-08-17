import styled from 'styled-components';

export const Form = styled.form`
    display : flex;
    flex-direction : column;
    justify-content : center;
    aligh-items : center;
    gap : 10px;
    width : 100%;
    box-sizing : border-box; 
    border-radius : 10px;
    // border : 1px solid gray;
`;

export const FormHeading = styled.h2`
    font-size : 16px;
    font-weight : 400;
    color : #475569;
    margin : 0;
    padding : 0;
    font-weight : 600;
`;

export const Divider = styled.hr`
    margin : 0.4%;
`;

export const FormContainer = styled.div`
    display : flex;
    flex-direction : row;  
    justify-content : center;
    align-items : flex-start;
    flex-wrap : wrap;
    min-height : 350px; 
    box-sizing : border-box; 
    // border : 1px solid gray;
`;

export const UserImage = styled.img`
    width : 80px;
    height : 80px;
    border-radius : 50%;
    object-fit : cover;
`;



