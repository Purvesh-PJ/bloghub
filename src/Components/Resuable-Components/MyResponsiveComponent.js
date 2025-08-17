import React from 'react';
import styled from 'styled-components';

// Styled-components for encapsulated CSS
const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%; /* Full width */
  max-width: 1200px; /* Max width for larger screens */
  padding: 20px;
  box-sizing: border-box; /* Include padding and border in element's total width and height */
  
  @media (max-width: 768px) {
    flex-direction: column; /* Stack items vertically on smaller screens */
  }
  
  @media (min-width: 769px) {
    flex-direction: ; /* Align items side by side on larger screens */
  }
`;

// Another styled component to handle default child styling
const ChildBox = styled.div`
  flex: 1;
  padding: 10px;
  margin: 10px;
  background-color: #f0f0f0; /* Light grey background for visibility */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  
  @media (max-width: 768px) {
    width: 100%; /* Full width for child boxes on small screens */
  }
  
  @media (min-width: 769px) {
    width: auto; /* Auto width on larger screens to allow flex behavior */
  }
`;

/**
 * A responsive container component that can accept custom children and className.
 * The component automatically adjusts layout depending on screen size.
 * 
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The child elements to render within the container.
 * @param {string} [props.className] - An optional className for custom styling.
 * @param {string} [props.role] - Optional ARIA role for accessibility.
 * 
 * @returns {JSX.Element} The responsive component.
 */
const MyResponsiveComponent = ({ children, className, role = 'region' }) => {
  return (
    <ResponsiveContainer className={className} role={role} aria-label="Responsive Container">
      {React.Children.map(children, (child) => (
        <ChildBox>{child}</ChildBox>
      ))}
    </ResponsiveContainer>
  );
};

export default MyResponsiveComponent;
