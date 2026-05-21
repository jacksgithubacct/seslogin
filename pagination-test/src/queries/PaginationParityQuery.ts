import { graphql } from 'relay-runtime';

graphql`
  query PaginationParityQuery($first: Int, $after: String, $parity: TestPaginationParity) {
    testPagination(first: $first, after: $after, parity: $parity) {
      edges {
        cursor
        node {
          id
          number
          name
          odd
          even
          mod5
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
