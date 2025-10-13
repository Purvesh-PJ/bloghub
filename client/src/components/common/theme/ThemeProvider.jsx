import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from './theme';

const ThemeProvider = ({ children }) => {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
