import { Box, Heading, Text, Card, Flex, Button } from '@radix-ui/themes';

export function AdminSettings() {
  return (
    <Box>
      <Heading size="7" mb="6">
        Admin Settings
      </Heading>
      <Card>
        <Flex direction="column" gap="4">
          <Box>
            <Text weight="medium" mb="2">
              Site Settings
            </Text>
            <Text size="2" color="gray">
              Configure site-wide settings and preferences.
            </Text>
          </Box>
          <Text color="gray" size="2">
            Admin settings functionality coming soon.
          </Text>
        </Flex>
      </Card>
    </Box>
  );
}
