import styled, { css } from 'styled-components';


export const Button = styled.button`
    display : flex;
    flex-direction : row;
    align-items : center;
    width : 100%;
    max-width : fit-content;
    min-width : fit-content;
    border: none;
    cursor: pointer;
    font-size : 14px;
    color : ${(props) => props.color || 'gray'};
    background-color : ${(props) => props.iconbtn ? 'transparent' : '#f9fafb'}; 
    ${(props) => props.border && css` border : ${props.border}` };
    border : ${(props) => props.needBorder || 'transparent'};
    border-radius : ${(props) => (props.rounded ? '50px' : '4px')};
    min-height : ${(props) => (props.size) ? '' : '35px' };

    
    ${(props) => props.size === 'x-sm' && css`
        padding: 3px 6px;
        height: 24px;
        font-size: 0.75rem; /* 12px */
        line-height: 1rem; /* 16px */
    `};

    ${(props) => props.size === 'sm' && css`
        padding: 4px 8px;
        height: 26px;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */ 
    `};
    
    ${(props) => props.size === 'md' && css`
        padding: 5px 10px;
        height: 30px;
        font-size: 1rem; /* 16px */
        line-height: 1.5rem; /* 24px */
    `};
    
    ${(props) => props.size === 'lg' && css`
        padding: 6px 12px;
        height: 35px;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
    `};

    ${(props) => props.size === 'x-lg' && css`
        padding: 8px 16px;
        height: 40px;
        font-size: 1.25rem; /* 20px */
        line-height: 1.75rem; /* 28px */
    `};
    
    ${(props) => props.filled && css`
        background-color : ${(props) => props.fillColor || '#F2F3F4 '};
        color: ${(props) => props.txtColor || 'gray'}; 
    `};

    ${(props) => props.outlined && css`
        background-color: transparent;
        border: 2px solid ${(props) => props.txtColor || '#007bff'};
        color: ${(props) => props.txtColor || '#007bff'} ;
    `};

    ${(props) => props.text && css`
        background-color: transparent;
        border: none;
        color: ${(props) => props.txtColor || '#007bff'};
    `};

    ${(props) => props.underlined && css`
        background-color: transparent;
        border: none;
        color: ${(props) => props.txtColor || '#007bff'};
        text-decoration: underline;
    `};

    ${(props) => props.iconbtn && css`
        background-color: transparent;
        border: none;
        color: ${(props) => props.txtColor || '#007bff'};
    `};

    &:hover {

        background-color : #f8fafc;
        color : #64748b;
        
        ${(props) => props.filled && css`
            background-color: gray;
            color: white; 
        `};

        ${(props) => props.outlined && css`
            border: 2px solid gray;
            color: gray;
            background-color: transparent;
        `};

        ${(props) => props.text && css`
            color: gray;
            background-color: transparent;
        `};

        ${(props) => props.underlined && css` 
            color: gray;
            background-color: transparent;
        `};

        ${(props) => props.iconbtn && css` 
            color: gray;
            background-color: transparent;
        `};
    }
`;  

export const DataManager = styled.div`
    display : flex;
    justify-content : space-between;
    align-items : center;
    flex-direction : ${(props) => (props.iconposition === 'right' ? 'row-reverse' : 'row')};
    gap : 8px;
`;

export const Icon = styled.div`
    display : flex;
    justify-content: center;
    align-items: center;
    margin : 0;
    pading : 0;
`;

export const ButtonText = styled.span`
    display : ${(props) => props.iconbtn ? 'none' : 'inline'};
`;
