import { Flex, Spinner, Text } from '@radix-ui/themes';

export function Loading({ text = 'Loading...' }) {
  return (
    <Flex direction="column" align="center" justify="center" gap="3" py="9">
      <Spinner size="3" />
      <Text size="2" color="gray">
        {text}
      </Text>
    </Flex>
  );
}
