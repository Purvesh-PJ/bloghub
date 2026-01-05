import { Link } from 'react-router-dom';
import { Box, Container, Flex, Text, Separator } from '@radix-ui/themes';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      style={{
        borderTop: '1px solid var(--gray-5)',
        backgroundColor: 'var(--gray-1)',
        marginTop: 'auto',
      }}
    >
      <Container size="4" py="6">
        <Flex direction={{ initial: 'column', sm: 'row' }} justify="between" align="center" gap="4">
          <Flex direction="column" gap="2">
            <Text size="4" weight="bold" style={{ color: 'var(--accent-9)' }}>
              BlogHub
            </Text>
            <Text size="1" color="gray">
              Share your stories with the world
            </Text>
          </Flex>

          <Flex gap="6">
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">Platform</Text>
              <Link to="/">
                <Text size="1" color="gray">Home</Text>
              </Link>
              <Link to="/search">
                <Text size="1" color="gray">Explore</Text>
              </Link>
              <Link to="/write">
                <Text size="1" color="gray">Write</Text>
              </Link>
            </Flex>
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">Account</Text>
              <Link to="/profile">
                <Text size="1" color="gray">Profile</Text>
              </Link>
              <Link to="/settings">
                <Text size="1" color="gray">Settings</Text>
              </Link>
              <Link to="/my-posts">
                <Text size="1" color="gray">My Posts</Text>
              </Link>
            </Flex>
          </Flex>
        </Flex>

        <Separator size="4" my="4" />

        <Flex justify="between" align="center">
          <Text size="1" color="gray">
            © {currentYear} BlogHub. All rights reserved.
          </Text>
          <Flex gap="4">
            <Text size="1" color="gray">Privacy</Text>
            <Text size="1" color="gray">Terms</Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
