import React from "react";
import { Container, Label, Input, Textarea } from "./InputField-Style";
import PropTypes from "prop-types";

const InputField = ({
  type,
  name ,
  value,
  label,
  placeholder,
  icon,
  textArea,
  onChange,
  labelSize,
  containerColor,
  containerWidth,
  containerMinWidth,
  containerMaxWidth,
  direction,
  inputBorderColor,
  inputFocusColor,
  textAreaMinWidth,
  textAreaMaxWidth,
  textAreaMinHeight, 
  textAreaMaxHeight, 
  textAreaResize,
  style,

}) => {
  
  return (
    
    <Container 
      containerColor={containerColor} 
      direction={direction} 
      containerWidth={containerWidth}
      containerMinWidth={containerMinWidth}
      containerMaxWidth={containerMaxWidth}
      style={style}
    >
      <Label htmlFor={label} labelSize={labelSize}> {icon} {label} </Label>
      { textArea ? (
        <Textarea
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          inputBorderColor={inputBorderColor}
          inputFocusColor={inputFocusColor}
          textAreaMinWidth={textAreaMinWidth}
          textAreaMaxWidth={textAreaMaxWidth}
          textAreaMinHeight={textAreaMinHeight}
          textAreaMaxHeight={textAreaMaxHeight}
          textAreaResize={textAreaResize}
        />
      ) :     
        <Input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          inputBorderColor={inputBorderColor}
          inputFocusColor={inputFocusColor}
        />
      }
    </Container>
  );
};

InputField.defaultPropTypes = {
  type : "text",
  name : "input",
  value : "",
  label : "label",
  labelSize : "",
  placeholder : "enter placeholder !",
  icon : null,
  containerColor : "",
  containerWidth : "100%",
  containerMinWidth : 'fit-content',
  containerMaxWidth : '',
  direction : "",
  inputBorderColor : "",
  inputFocusColor : "",
  textArea : false,
  textAreaMinWidth : "fit-content",
  textAreaMaxWidth : "",
  textAreaMinHeight : "fit-content", 
  textAreaMaxHeight : "", 
  textAreaResize : "both",
  style : {},
};

InputField.propTypes = {
  type : PropTypes.string,
  name : PropTypes.string,
  value : PropTypes.string,
  label : PropTypes.string,
  labelSize : PropTypes.string,
  placeholder : PropTypes.string,
  icon : PropTypes.node,
  onChange : PropTypes.func,
  containerColor : PropTypes.string,
  containerWidth : PropTypes.string,
  containerMinWidth : PropTypes.string, 
  containerMaxWidth : PropTypes.string,
  direction : PropTypes.string,
  inputBorderColor : PropTypes.string,
  inputFocusColor : PropTypes.string,
  textArea : PropTypes.bool,
  textAreaMinWidth : PropTypes.string,
  textAreaMaxWidth : PropTypes.string,
  textAreaMinHeight : PropTypes.string,
  textAreaMaxHeight : PropTypes.string,
  textAreaResize : PropTypes.string,
  style : PropTypes.object,
};

export default InputField;
