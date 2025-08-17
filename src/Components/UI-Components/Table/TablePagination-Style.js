import styled from 'styled-components';
import { FiChevronLeft } from 'react-icons/fi';
import { FiChevronRight } from 'react-icons/fi';
import { FiChevronsLeft } from 'react-icons/fi';
import { FiChevronsRight } from 'react-icons/fi';

export const ParentContainer = styled.div`
    display : flex;
    flex-direction : row;
    border : 1px solid #f1f5f9;
    border-radius : 10px;
    background-color : white;
    justify-content : center;
    align-items : center;
    gap : 10px;
    width : 250px;
    min-width : 250px;
    margin-left : auto;
`;

export const PageIndexWrapper = styled.div`
    display : flex;
    flex-direction : row;
    justify-content : center;
    align-items : center;
    gap : 5px;
    font-size : 12px;
    margin-left : auto;
`;

export const NavigationButtonsWrapper = styled.div`
    display : flex;
    gap : 10px;
    margin-left : 8px;
    margin-right : 8px;
`;

export const PageTypo = styled.p`
    color : #334155;
`;

export const Span = styled.span`
`;

export const Strong = styled.strong`
`;

export const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    font-weight: 500;
    font-size: 20px;
    background-color : transparent;
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

    &:hover {
        background-color: ${({ disabled }) => (disabled ? '' : '#EEF8FF')};
        color: ${({ disabled }) => (disabled ? '' : '#37AAFF ')};
    }
`;

export const IconNext = styled(FiChevronRight)`
`;

export const IconGotoNext = styled(FiChevronsRight)`
`;

export const IconPrevious = styled(FiChevronLeft)`
`;

export const IconGotoPrevious = styled(FiChevronsLeft)`
`;