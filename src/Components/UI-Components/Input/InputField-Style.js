import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  background-color: ${(props) => props.containerColor || "#f1f5f9"};
  justify-content: center;
  width : ${(props) => props.containerWidth};
  min-width : ${(props) => props.containerMinWidth};
  max-width : ${(props) => props.containerMaxWidth};
  border-radius: 6px;
  box-sizing : border-box;
  padding: 6px;
  gap: 4px;
  // border : 1px solid gray;
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  width : fit-content;
  text-align: left;
  letter-spacing: 0.020rem;
  padding: 4px;
  font-size: ${(props) => props.labelSize || "small"};
  font-weight: 500;
  color: #475569;
  gap: 4px;
  // border: 2px solid gray;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  color : #475569;
  outline: none;
  border: 2px solid ${(props) => props.inputBorderColor || "#cbd5e1"};
  background-color: white;

  &:focus {
    border: 2px solid ${(props) => props.inputFocusColor || "#94a3b8"};
  }
`;

export const Textarea = styled.textarea`
  width : 100%;
  min-width : ${(props) => props.textAreaMinWidth}; 
  max-width : ${(props) => props.textAreaMaxWidth}; 
  min-height : ${(props) => props.textAreaMinHeight};
  max-height : ${(props) => props.textAreaMaxHeight};
  padding: 10px;
  box-sizing: border-box;
  border-radius: 4px;
  outline: none;
  color : #475569;
  background-color: white;
  font-size : 16px;
  border: 2px solid ${(props) => props.inputBorderColor || "#cbd5e1"};
  resize : ${(props) => props.textAreaResize};

  &:focus {
    border: 2px solid ${(props) => props.inputFocusColor || "#94a3b8"};
  }
`;
