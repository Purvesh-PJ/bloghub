import { Button, Icon, DataManager, ButtonText } from './MultiUseButton-Style';
import PropTypes from 'prop-types';

const MultiUseButton = ({ 

    children,
    btnText, 
    filled, 
    border, 
    outlined, 
    text, 
    underlined, 
    size, 
    rounded, 
    onClick, 
    icon, 
    iconposition, 
    txtColor, 
    fillColor, 
    iconbtn,
    needBorder,
    style,
    color, 

}) => {
    
    return (
        <Button 
            filled={filled} 
            border={border} 
            outlined={outlined} 
            text={text} 
            underlined={underlined} 
            iconbtn={iconbtn} 
            size={size} 
            rounded={rounded} 
            onClick={onClick} 
            fillColor={fillColor} 
            txtColor={txtColor}
            aria-label={btnText || 'button'}
            needBorder={needBorder}
            color={color}
            style={style}
        >
            <DataManager iconposition={iconposition}>
                {
                    icon && <Icon iconbtn={iconbtn}> {icon} </Icon>
                }
                {
                    children || <ButtonText iconbtn={iconbtn}> {btnText} </ButtonText>
                } 
            </DataManager>
            
        </Button>
    )
};

MultiUseButton.defaultProps = {
    filled: false,
    outlined: false,
    text: false,
    underlined: false,
    rounded: false,
    iconposition: 'left',
    iconbtn : false,
    btnText: 'button',
    needBorder: '1px solid #e2e8f0',
};

MultiUseButton.propTypes = {
    children : PropTypes.node,
    btnText: PropTypes.string,
    filled: PropTypes.bool,
    border: PropTypes.string,
    borderColor: PropTypes.string,
    outlined: PropTypes.bool,
    text: PropTypes.bool,
    underlined: PropTypes.bool,
    size: PropTypes.oneOf(['x-sm', 'sm', 'md', 'lg', 'x-lg']),
    rounded: PropTypes.bool,
    onClick: PropTypes.func,
    icon: PropTypes.node,
    iconposition: PropTypes.oneOf(['left', 'right']),
    txtColor: PropTypes.string,
    fillColor: PropTypes.string,
    iconbtn: PropTypes.bool,
    needBorder: PropTypes.string,
    color: PropTypes.string
};




export default MultiUseButton;

