import styled from 'styled-components';


export const DialogBox = styled.dialog`
  border : none;
  border-radius : 10px;
  padding : 0;
`;

export const DialogHeader = styled.div`
  display : flex;
  flex-direction : row;
  justify-content : space-between;
  align-items : center;
  padding : 0px 16px 0px 16px;
  height : 60px;
  // border : 1px solid gray;
`;

export const DialogContainer = styled.div`
  // border : 1px solid gray;
`;

export const Title = styled.h2`
  font-weight : 500;
  font-size : 18px;
  color : #475569;
`;

export const CloseButton = styled.button`
  // width : 120px;
  // height : 40px;
`; 
