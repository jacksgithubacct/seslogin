import { graphql } from 'relay-runtime';

graphql`
  query PaginationForwardQuery($first: Int, $after: String) {
    testPagination(first: $first, after: $after) {
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
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
