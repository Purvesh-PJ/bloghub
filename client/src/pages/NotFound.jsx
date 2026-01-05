import { Link } from 'react-router-dom';
import { Container, Flex, Heading, Text, Button } from '@radix-ui/themes';

export function NotFound() {
  return (
    <Container size="1" py="9">
      <Flex direction="column" align="center" gap="4">
        <Heading size="9" color="gray">
          404
        </Heading>
        <Heading size="5">Page Not Found</Heading>
        <Text color="gray" align="center">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </Flex>
    </Container>
  );
}
