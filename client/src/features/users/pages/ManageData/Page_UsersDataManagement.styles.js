import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div``;

export const DataTableWrapper = styled.div`
  // border : 1px solid gray;
  margin-left: 50px;
  margin-right: 50px;
`;

export const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 500px;
  border-radius: 5px;
  border: 1px solid gray;
  // background-color : #f9fafb;
  border: 1px solid #e2e8f0;
  margin-top: 5rem;
`;

export const LinkRoute = styled(Link)`
  cursor: pointer;
  // border : 1px solid #e5e7eb;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 5px;
  color: #2563eb;

  &:hover {
    // border : 2px solid #3b82f6;
    color: #3b82f6;
    text-decoration: underline;
  }
`;

export const Text = styled.p`
  margin: 0;
  font-size: 0.8rem;
  font-weight: 400;
  color: #2563eb;
`;

export const FixedHeaderSizeTitle = styled.div`
  //   border : 1px solid gray;
  //   width : 600px;
  // font-weight : 500;
  font-size: 17px;
  color: #34495e;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const ActionWrapper = styled.div`
  transition: opacity 0.3s;
`;

export const ActionButton = styled.div`
  display: flex;
  gap: 10px;
`;
