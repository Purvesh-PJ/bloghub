import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// Animations
const fadeIn = keyframes`
  from { 
    opacity: 0; transform: translateY(10px); 
  }
  
  to { 
    opacity: 1; transform: translateY(0);
   }
`;

const pulse = keyframes`
  0% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.05); 
  }
  100% { 
    transform: scale(1); 
  }
`;

// Main container
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
  overflow: hidden;
`;

// Profile section with cleaner look
export const ProfileWrapper = styled.div`
  position: relative;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(240, 240, 240, 0.5);
  color: white;
  overflow: hidden;
  margin : 0.80rem;
  border-radius: 16px;
  flex-shrink: 0;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }
`;

// Image container with halo effect
export const ImageContainer = styled.div`
  position: relative;
  margin-bottom: 0.6rem;
  z-index: 1;
  
  &::after {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    z-index: -1;
    opacity: 0.7;
  }
`;

export const AdminProfileImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
`;

export const AdminProfileName = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
    color: gray;
    margin: 0 0 0.25rem 0;
    z-index: 1;
`;

export const UserRole = styled.span`
    font-size: 0.75rem;
    font-weight: 400;
    color: white;
    background: rgb(32, 136, 255);
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    margin-bottom: 1rem;
    z-index: 1;
`;

export const UserProfileLink = styled.button`
    background: white;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(153, 153, 153, 0.3);
    color: gray;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 1;
    
    &:hover {
      color : rgb(24, 79, 197);
      border: 1px solid rgb(24, 79, 197);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
`;

// Navigation section
export const ListNavigationWrapper = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }
`;

export const CategorySection = styled.div`
  margin-bottom: 1.2rem;
  animation: ${fadeIn} 0.4s ease-out;
  animation-fill-mode: both;
  
  &:nth-child(2) {
    animation-delay: 0.1s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(4) {
    animation-delay: 0.3s;
  }
`;

export const ItemCategory = styled.span`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: oklch(44.6% 0.043 257.281);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
  
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e2e8f0;
    margin-left: 0.75rem;
  }
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  color:oklch(44.6% 0.043 257.281);
  border-radius: 10px;
  padding: 0.45rem 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
    transform: translateX(2px);
  }
`;

export const ItemsName = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
`;

export const Icons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  font-size: 0.895rem;
  background: transparent;
  color: inherit;
  transition: all 0.2s ease;
`;

export const LocationLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  width: 100%;
  position: relative;
  
  &.active {
    ${ListItem} {
      background: linear-gradient(90deg, oklch(92.9% 0.013 255.508), transparent);
      color : oklch(20.8% 0.042 265.755);
      font-weight: 500;
    }
  }
`;

// Bottom section
export const BottomSection = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-shrink: 0;
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  font-weight: 500;
  font-size: 0.75rem;
  background: none;
  border: none;
  padding: 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #fee2e2;
    color: #ef4444;
  }
  
  svg {
    font-size: 0.895rem;
  }
`;

export const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  font-weight: 500;
  font-size: 0.75rem;
  background: none;
  border: none;
  padding: 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
  
  svg {
    font-size: 0.875rem;
  }
`;

export const StatusIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #10b981;
  border: 2px solid white;
`;
