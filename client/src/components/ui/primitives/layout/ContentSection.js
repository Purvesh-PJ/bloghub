import styled from 'styled-components';

/**
 * ContentSection - Groups related content with vertical spacing
 * More specialized than Box for content sections
 * 
 * @example
 * <ContentSection $gap={8} $p={6} $bg="surface">
 *   <Heading>Features</Heading>
 *   <Text>Feature description...</Text>
 *   <FeatureList />
 * </ContentSection>
 */
export const ContentSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${(p) =>
    typeof p.$gap === 'number' ? p.theme.spacing(p.$gap) : p.$gap || p.theme.spacing(6)};
  padding: ${(p) =>
    p.$p !== undefined
      ? typeof p.$p === 'number'
        ? p.theme.spacing(p.$p)
        : p.$p
      : '0'};
  margin: ${(p) =>
    p.$m !== undefined
      ? typeof p.$m === 'number'
        ? p.theme.spacing(p.$m)
        : p.$m
      : '0'};
  background: ${(p) => p.$bg || 'transparent'};
`;

export default ContentSection;