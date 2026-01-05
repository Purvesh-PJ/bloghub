import { Box, Heading, Text, Card } from '@radix-ui/themes';

export function AdminUsers() {
  return (
    <Box>
      <Heading size="7" mb="6">
        Users
      </Heading>
      <Card>
        <Text color="gray">
          User management functionality coming soon. The backend needs additional endpoints for listing all users.
        </Text>
      </Card>
    </Box>
  );
}
