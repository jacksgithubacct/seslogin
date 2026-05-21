use anyhow::{Result, anyhow};
use async_graphql::connection::{Connection, Edge, EmptyFields};

/// Validate and extract `(page_size, is_last_mode)` from GraphQL `first`/`last` args.
///
/// Returns an error if both are specified, either is negative, or either exceeds
/// `max_size`. Returns `(default_size, false)` when neither is specified.
pub fn pagination_args(
    first: Option<i32>,
    last: Option<i32>,
    default_size: usize,
    max_size: usize,
) -> Result<(usize, bool)> {
    match (first, last) {
        (Some(_), Some(_)) => Err(anyhow!("Cannot specify both first and last")),
        (Some(v), None) => {
            if v < 0 {
                return Err(anyhow!("first must be non-negative"));
            }
            if v as usize > max_size {
                return Err(anyhow!("first must be less than or equal to {}", max_size));
            }
            Ok((v as usize, false))
        }
        (None, Some(v)) => {
            if v < 0 {
                return Err(anyhow!("last must be non-negative"));
            }
            if v as usize > max_size {
                return Err(anyhow!("last must be less than or equal to {}", max_size));
            }
            Ok((v as usize, true))
        }
        (None, None) => Ok((default_size, false)),
    }
}

/// Build a Relay connection from rows returned by the DB layer.
///
/// The DB layer is expected to have fetched `page_size + 1` rows so that
/// `hasNextPage`/`hasPreviousPage` can be inferred from the count. `to_edge`
/// maps each row into its `(cursor, node)` pair.
pub fn build_connection<T, N, F>(
    rows: Vec<T>,
    page_size: usize,
    is_last_mode: bool,
    has_after: bool,
    has_before: bool,
    to_edge: F,
) -> Connection<String, N, EmptyFields, EmptyFields>
where
    F: Fn(&T) -> (String, N),
    N: async_graphql::OutputType,
{
    let mut rows = rows;
    let fetched_extra = if rows.len() > page_size {
        rows.truncate(page_size);
        true
    } else {
        false
    };
    if is_last_mode {
        rows.reverse();
    }

    let has_previous_page = if is_last_mode {
        fetched_extra || has_after
    } else {
        has_after
    };
    let has_next_page = if is_last_mode {
        has_before
    } else {
        fetched_extra
    };

    let mut conn = Connection::new(has_previous_page, has_next_page);
    conn.edges = rows
        .iter()
        .map(|row| {
            let (cursor, node) = to_edge(row);
            Edge::new(cursor, node)
        })
        .collect();
    conn
}
