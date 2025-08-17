import styled from 'styled-components';

export const ParentContainer = styled.div`
    // border : 1px solid gray;
    width : 350px;
    height : 550px;
    margin : auto;
    margin-top : 10rem;
    padding : 15px;
    background-color : white;
    border-radius : 10px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
`;

export const Form = styled.form`
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    gap : 20px;
    padding : 10px;
`;

export const Label = styled.label`
    margin-right : auto;
`;

export const Input = styled.input`
    width : 100%;   
    padding : 5px;
`;

export const LoginButton = styled.button`
    width : 50%;
    padding : 10px;
`;

export const FormTitle = styled.h1`
    font-size : 24px;
    text-align : center;
`;