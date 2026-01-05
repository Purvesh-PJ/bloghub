import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Flex, Heading, Text, Card } from '@radix-ui/themes';
import { searchService } from '../services/searchService';
import { Loading } from '../components/common/Loading';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchService.search(query),
    enabled: Boolean(query),
  });

  if (!query) {
    return (
      <Container size="2" py="9">
        <Text color="gray">Enter a search term to find posts</Text>
      </Container>
    );
  }

  if (isLoading) {
    return <Loading text="Searching..." />;
  }

  const results = data?.data || [];

  return (
    <Container size="2" py="6">
      <Flex direction="column" gap="5">
        <Box>
          <Heading size="6" mb="2">
            Search Results
          </Heading>
          <Text size="2" color="gray">
            {results.length} results for "{query}"
          </Text>
        </Box>

        {results.length === 0 ? (
          <Text color="gray">No posts found matching your search</Text>
        ) : (
          <Flex direction="column" gap="3">
            {results.map((result) => (
              <Card key={result._id} asChild>
                <Link to={`/post/${result._id}`}>
                  <Flex direction="column" gap="2">
                    <Text size="4" weight="medium">
                      {result.title}
                    </Text>
                    <Text size="2" color="gray" className="text-truncate-2">
                      {result.truncatedContent}
                    </Text>
                  </Flex>
                </Link>
              </Card>
            ))}
          </Flex>
        )}
      </Flex>
    </Container>
  );
}
