import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  // max-width: 800px;
`;

export const SettingsCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  // border: 1px solid #e2e8f0;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
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
    font-size: 16px;
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
  margin: 12px 0 0 0;
  line-height: 1.5;
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
  margin: 0 0 8px 0;
`;

export const ToggleOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const OptionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #334155;
  margin-bottom: 4px;
`;

export const OptionDescription = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  max-width: 400px;
  line-height: 1.5;
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
`;

export const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: oklch(0.372 0.044 257.287);
  }
  
  &:checked + span:before {
    transform: translateX(20px);
  }
  
  &:focus + span {
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

export const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: oklch(0.707 0.022 261.325);
  transition: 0.3s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
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
  margin: 0 0 0.10rem 0.30rem;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: oklch(27.9% 0.041 260.031);
  color: white;
  align-self: flex-start;
  border : none;
  
  &:hover {
    background-color: oklch(44.6% 0.043 257.281);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px oklch(55.4% 0.046 257.417);
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #64748b;
    pointer-events: none;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  font-size: 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #1e293b;
  background-color: white;
  transition: all 0.2s ease;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RadioOption = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
  }
  
  input:checked + label {
    color: #4f46e5;
  }
  
  input:checked ~ & {
    border-color: #4f46e5;
    background-color: rgba(79, 70, 229, 0.05);
  }
`;

export const RadioInput = styled.input`
  margin-top: 3px;
  accent-color: oklch(0.446 0.043 257.281);
`;

export const RadioLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  strong {
    font-size: 0.75rem;
    font-weight: 500;
    color: #1e293b;
  }
  
  span {
    font-size: 0.75rem;
    color: #64748b;
  }
`; 