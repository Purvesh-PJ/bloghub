import styled, { css } from 'styled-components';
import { useState, useRef, useEffect } from 'react';

// Tooltip wrapper that manages visibility
export const TooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

// Tooltip content bubble
export const TooltipContent = styled.div`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.tooltip || 1400};
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  background: ${({ theme }) => theme.palette.grey[900]};
  color: ${({ theme }) => theme.palette.common.white};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.snug};
  border-radius: ${({ theme }) => theme.radii.md};
  white-space: ${({ $nowrap }) => ($nowrap ? 'nowrap' : 'normal')};
  max-width: ${({ $maxWidth }) => $maxWidth || '200px'};
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition:
    opacity ${({ theme }) => theme.motion.duration.fast},
    visibility ${({ theme }) => theme.motion.duration.fast};

  /* Positioning based on placement */
  ${({ $placement = 'top' }) => {
    switch ($placement) {
      case 'top':
        return css`
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'bottom':
        return css`
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'left':
        return css`
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        `;
      case 'right':
        return css`
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        `;
      default:
        return css`
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
    }
  }}

  /* Arrow */
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;

    ${({ $placement = 'top', theme }) => {
      const arrowColor = theme.palette.grey[900];
      switch ($placement) {
        case 'top':
          return css`
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 4px 4px 0 4px;
            border-color: ${arrowColor} transparent transparent transparent;
          `;
        case 'bottom':
          return css`
            top: -4px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 0 4px 4px 4px;
            border-color: transparent transparent ${arrowColor} transparent;
          `;
        case 'left':
          return css`
            right: -4px;
            top: 50%;
            transform: translateY(-50%);
            border-width: 4px 0 4px 4px;
            border-color: transparent transparent transparent ${arrowColor};
          `;
        case 'right':
          return css`
            left: -4px;
            top: 50%;
            transform: translateY(-50%);
            border-width: 4px 4px 4px 0;
            border-color: transparent ${arrowColor} transparent transparent;
          `;
        default:
          return '';
      }
    }}
  }
`;

// Tooltip Component with hover logic
export function Tooltip({
  children,
  content,
  $placement = 'top',
  $nowrap = true,
  $maxWidth,
  $delay = 200,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, $delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!content) return children;

  return (
    <TooltipWrapper onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      {children}
      <TooltipContent
        $visible={visible}
        $placement={$placement}
        $nowrap={$nowrap}
        $maxWidth={$maxWidth}
        role="tooltip"
      >
        {content}
      </TooltipContent>
    </TooltipWrapper>
  );
}

export default Tooltip;
