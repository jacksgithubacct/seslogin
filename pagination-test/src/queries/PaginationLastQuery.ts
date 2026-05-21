import { graphql } from 'relay-runtime';

graphql`
  query PaginationLastQuery($last: Int) {
    testPagination(last: $last) {
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
