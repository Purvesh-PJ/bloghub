import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    /* Minimal reset */
    *, *::before, *::after {
        box-sizing: border-box;
    }

    html, body, #root {
        min-height: 100%;
    }

    body {
        margin: 0;
        padding: 0;
        font-family: ${({ theme }) => theme.typography.fontFamily?.body || '"Poppins", sans-serif'};
        background-color: ${({ theme }) => theme.palette.background.default};
        color: ${({ theme }) => theme.palette.text.primary};
        -webkit-font-smoothing : antialiased;
        -moz-osx-font-smoothing : grayscale;
        transition: background-color ${({ theme }) => theme.motion.duration.normal} ${({ theme }) => theme.motion.easing.standard}, color ${({ theme }) => theme.motion.duration.normal} ${({ theme }) => theme.motion.easing.standard};
    }

    code {
        font-family : ${({ theme }) => theme.typography.fontFamily?.mono || "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"};
    }

    h1 {
        font-family: ${({ theme }) => theme.typography.fontFamily?.heading || '"Open Sans", sans-serif'};
        font-weight: ${({ theme }) => theme.typography.weight?.semibold || 650};
        font-size: ${({ theme }) => theme.typography.size?.h1 || '2.25rem'}; /* 36px */
        line-height: ${({ theme }) => theme.typography.lineHeight?.snug || '2.5rem'}; /* 40px */
        letter-spacing: 0.010em;
        color: ${({ theme }) => theme.palette.text.primary};
    }

    h2 {
        font-family: ${({ theme }) => theme.typography.fontFamily?.heading || '"Open Sans", sans-serif'};
        font-weight: ${({ theme }) => theme.typography.weight?.semibold || 600};
        font-size: ${({ theme }) => theme.typography.size?.h2 || '1.875rem'}; /* 30px */
        line-height: ${({ theme }) => theme.typography.lineHeight?.snug || '2.25rem'}; /* 36px */
        letter-spacing: 0.010em;
        color: ${({ theme }) => theme.palette.text.primary};
    }

    h3 {
        font-family: ${({ theme }) => theme.typography.fontFamily?.heading || '"Open Sans", sans-serif'};
        font-weight: ${({ theme }) => theme.typography.weight?.medium || 550};
        font-size: ${({ theme }) => theme.typography.size?.h3 || '1.5rem'}; /* 24px */
        line-height: ${({ theme }) => theme.typography.lineHeight?.normal || '2rem'}; /* 32px */
        letter-spacing: 0.010em;
        color: ${({ theme }) => theme.palette.text.primary};
    }

    h4 {
        font-family: ${({ theme }) => theme.typography.fontFamily?.heading || '"Open Sans", sans-serif'};
        font-weight: ${({ theme }) => theme.typography.weight?.medium || 500};
        font-size: ${({ theme }) => theme.typography.size?.xl || '1.25rem'}; /* 20px */
        line-height: ${({ theme }) => theme.typography.lineHeight?.normal || '1.75rem'}; /* 28px */
        letter-spacing: 0.010em;
        color: ${({ theme }) => theme.palette.text.primary};
    }

    h5 {
        font-family: ${({ theme }) => theme.typography.fontFamily?.heading || '"Open Sans", sans-serif'};
        font-weight: ${({ theme }) => theme.typography.weight?.medium || 500};
        font-size: ${({ theme }) => theme.typography.size?.lg || '1.125rem'}; /* 18px */
        line-height: ${({ theme }) => theme.typography.lineHeight?.normal || '1.75rem'}; /* 28px */
        letter-spacing: 0.010em;
        color: ${({ theme }) => theme.palette.text.primary};
    }


    p {
        font-weight: ${({ theme }) => theme.typography.weight?.regular || 400};
        font-size: ${({ theme }) => theme.typography.size?.md || '1rem'}; /* 16px */
        line-height: ${({ theme }) => theme.typography.lineHeight?.normal || '1.5rem'}; /* 24px */
        letter-spacing: 0.04em;
        color : ${({ theme }) => theme.palette.text.secondary};
    }

    /* Respect reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }

`;

export default GlobalStyle;
