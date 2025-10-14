import styled from 'styled-components';

/**
 * Page - Root wrapper for each route, semantic main element
 * Controls vertical layout and optional padding
 * 
 * @example
 * <Page $bg="surface" $p={6}>
 *   <Header />
 *   <MainContent />
 *   <Footer />
 * </Page>
 */
export const Page = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: ${(p) => p.$bg || p.theme.palette.background.default};
  padding: ${(p) =>
    p.$p !== undefined
      ? typeof p.$p === 'number'
        ? p.theme.spacing(p.$p)
        : p.$p
      : '0'};
`;

export default Page;