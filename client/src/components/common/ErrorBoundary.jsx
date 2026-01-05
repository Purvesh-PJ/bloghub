import { Component } from 'react';
import { Box, Container, Flex, Heading, Text, Button, Card } from '@radix-ui/themes';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="1" py="9">
          <Card>
            <Flex direction="column" align="center" gap="4" p="6">
              <Heading size="6" color="red">Something went wrong</Heading>
              <Text color="gray" align="center">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </Text>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </Flex>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}
