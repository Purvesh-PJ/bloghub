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
  margin: 8px 0;
  line-height: 1.5;
`;

export const CardContent = styled.div`
  padding: 16px 20px 20px;
`;

export const InfoSection = styled.div`
  margin-bottom: 24px;

  h3 {
    font-size: 0.75rem;
    font-weight: 600;
    color: #334155;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 0.75rem;
    color: #64748b;
    margin: 0 0 14px 0;
    line-height: 1.5;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 16px;

  ${({ plan }) => {
    if (plan === 'free') {
      return `
        background-color: #f1f5f9;
        color: #64748b;
        border: 1px solid #e2e8f0;
      `;
    } else {
      return `
        background-color: #ede9fe;
        color: #6d28d9;
        border: 1px solid #ddd6fe;
      `;
    }
  }}
`;

export const PlanFeatures = styled.ul`
  list-style: none;
  margin: 0 0 20px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.75rem;

  svg {
    color: ${(props) => (props.available ? '#10b981' : '#ef4444')};
  }

  span {
    color: ${(props) => (props.available ? '#334155' : '#94a3b8')};
    text-decoration: ${(props) => (props.available ? 'none' : 'line-through')};
  }
`;

export const SubscriptionDetails = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DetailLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const DetailValue = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #334155;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 4px;
  margin: 0 0 0.1rem 0.3rem;
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

export const Divider = styled.div`
  height: 1px;
  background-color: #e2e8f0;
  margin: 24px 0;
`;

export const DangerCard = styled.div`
  border: 1px solid oklch(0.704 0.191 22.216);
  border-radius: 8px;
  padding: 16px;
  background-color: oklch(0.971 0.013 17.38);
`;

export const DangerTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: oklch(0.704 0.191 22.216);
  margin: 0 0 8px 0;
`;

export const DangerDescription = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

export const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: white;
  color: #ef4444;
  border: none;

  &:hover {
    background-color: #fee2e2;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(254, 202, 202, 0.5);
  }
`;

export const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
`;

export const ModalDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const ModalButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;

  ${(props) => {
    if (props.danger) {
      return `
        background-color: #ef4444;
        color: white;
        border: 1px solid #ef4444;
        
        &:hover {
          background-color: #b91c1c;
          border-color: #b91c1c;
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
        }
      `;
    } else if (props.secondary) {
      return `
        background-color: #f1f5f9;
        color: #334155;
        border: 1px solid #e2e8f0;
        
        &:hover {
          background-color: #e2e8f0;
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(226, 232, 240, 0.5);
        }
      `;
    }
  }}
`;
