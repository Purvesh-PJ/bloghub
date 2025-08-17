import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    body {
        margin : 0;
        padding: 0;
        font-family: "Poppins", sans-serif;
        height : 100vh;
        background-color: #f8fafc;
        -webkit-font-smoothing : antialiased;
        -moz-osx-font-smoothing : grayscale;
    }

    code {
        font-family : source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    }

    h1 {
        font-family: "Open Sans", sans-serif;
        font-weight: 650;
        font-size: 2.25rem; /* 36px */
        line-height: 2.5rem; /* 40px */
        letter-spacing: 0.010em;
        color: rgb(15 23 42);
    }

    h2 {
        font-family: "Open Sans", sans-serif;
        font-weight: 600;
        font-size: 1.875rem; /* 30px */
        line-height: 2.25rem; /* 36px */
        letter-spacing: 0.010em;
        color: rgb(30 41 59);
    }

    h3 {
        font-family: "Open Sans", sans-serif;
        font-weight: 550;
        font-size: 1.5rem; /* 24px */
        line-height: 2rem; /* 32px */
        letter-spacing: 0.010em;
        color: rgb(51 65 85);
    }

    h4 {
        font-family: "Open Sans", sans-serif;
        font-weight: 500;
        font-size: 1.25rem; /* 20px */
        line-height: 1.75rem; /* 28px */
        letter-spacing: 0.010em;
        color: rgb(71 85 105);
    }

    h5 {
        font-family: "Open Sans", sans-serif;
        font-weight: 500;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
        letter-spacing: 0.010em;
        color: rgb(71 85 105);
    }


    p {
        font-weight: 400;
        font-size: 0.90rem; /* 16px */
        line-height: 1.3rem; /* 24px */
        font-size: 1rem; /* 16px */
        line-height: 1.5rem; /* 24px */
        letter-spacing: 0.04em;
        color : #405477;
    }

`;

export default GlobalStyle;