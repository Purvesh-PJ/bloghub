import styled from 'styled-components';

export const Container = styled.div`
    display : flex;
    flex-direction : column;
    gap : 1.5rem;
    background-color : white;
    padding : 1rem;
    margin : 1rem;
    border-radius : 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const DashboardAnalyticsWrapper = styled.div`
`;

export const UsersDemographicDataWrapper = styled.div`
    display : flex;
    flex-direction : row;
    justify-content : space-around;
    border : 1px solid gray;
    border-radius : 10px;
    padding : 2rem;
`;

export const TopArticlesAnalyticsWrapper = styled.div`
`;

export const UsersDemographicTitleWrapper = styled.div`
`;

export const TopArticlesTitleWrapper = styled.div`
    padding : 4px;
    border-radius : 10px;
`;

export const Heading = styled.h1`
    font-size : 24px;
    font-weight : 500;
    color : gray;
`;