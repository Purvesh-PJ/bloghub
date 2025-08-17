import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';

export const Span = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    border: 1px solid #e2e8f0;
    border-radius: 5px;
    color: gray;
    background-color : #f9fafb;
    // width : 100%;
    &:hover {
        border: 1px solid #cbd5e1;
    }
    &:focus-within {
        border: 1px solid #cbd5e1;
    }
`;

export const SearchIcon = styled(BiSearch)`
    font-size: 18px;
    min-width : 50px;
`;

export const SearchInput = styled.input`
    outline: none;
    border: none;
    border-radius: 5px;
    width: 100%;
    padding: 16px;
    background-color : #f8fafc;
    &:focus {
        & ~ ${Span} {
            border: 1px solid #5DADE2;
            color : #5DADE2;
        }
    }
`;
