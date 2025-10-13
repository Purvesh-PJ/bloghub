import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  // max-width: 800px;
  // border: 1px solid #e2e8f0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const SettingsCard = styled.div`
  overflow: hidden;
  transition: all 0.3s ease;
  // border: 1px solid #e2e8f0;

  &:hover {
    // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
`;

export const CardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  // background-color: rgba(79, 70, 229, 0.1);
  color: oklch(0.372 0.044 257.287);

  svg {
    font-size: 14px;
  }
`;

export const CardTitle = styled.h2`
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  padding: 0 20px;
  margin: 12px 0;
  line-height: 1.2;
`;

export const CardContent = styled.div`
  padding: 16px 20px 20px;
`;

export const Section = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 16px 0;
`;

export const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
`;

export const ThemeOption = styled.div`
  position: relative;
  cursor: pointer;

  &:hover {
    // transform: translateY(-2px);
    background-color: #f1f5f9;
    border-radius: 12px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    border: 2px solid ${(props) => (props.selected ? 'oklch(0.554 0.046 257.417)' : 'transparent')};
    pointer-events: none;
  }
`;

export const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
`;

export const ThemePreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;

  &.light {
    // background-color: #ffffff;
    // border: 1px solid #e2e8f0;

    svg {
      color: oklch(0.446 0.043 257.281);
      font-size: 24px;
      z-index: 1;
    }
  }

  &.dark {
    // background-color: #1e293b;
    // border: 1px solid #334155;

    svg {
      color: oklch(0.446 0.043 257.281);
      font-size: 24px;
      z-index: 1;
    }
  }

  &.system {
    // background: linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #1e293b 50%, #1e293b 100%);
    // border: 1px solid #e2e8f0;

    svg {
      color: oklch(0.446 0.043 257.281);
      font-size: 24px;
      z-index: 1;
    }
  }
`;

export const ThemeTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #334155;
  text-align: center;
  margin: 1rem;
`;

export const ColorPalette = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ColorSwatch = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: 2px solid ${(props) => (props.selected ? 'white' : 'transparent')};
  box-shadow: ${(props) => (props.selected ? `0 0 0 2px ${props.color}` : 'none')};

  &:hover {
    transform: scale(1.1);
  }

  span {
    color: white;
    font-weight: bold;
    font-size: 14px;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #e2e8f0;
  margin: 20px 0;
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 4px;
  margin: 0 0 16px 16px;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: oklch(27.9% 0.041 260.031);
  color: white;
  align-self: flex-start;
  border: none;

  &:hover {
    background-color: oklch(44.6% 0.043 257.281);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px oklch(55.4% 0.046 257.417);
  }
`;
