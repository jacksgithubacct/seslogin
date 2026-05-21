use async_graphql::ID;
use async_graphql::dataloader::DataLoader;
use async_graphql::{EmptySubscription, Schema};
use std::sync::Arc;

use crate::app::App;
use crate::app::HasDb;
use crate::app::HasSqs;
use crate::request_metrics;

pub mod auth;
pub mod dataloader;
pub mod mutations;
pub mod pagination;
pub mod query;

pub use self::mutations::MutationRoot;
pub use self::query::{
    ApiToken, Category, CategoryMemberPeriodSummary, CategoryPeriodSummary, Location,
    MemberCategoryPeriodSummary, MemberPeriodSummary, NitcExportStatus, NitcGroup, Period, Person,
    QueryRoot, Session, User,
};

use self::dataloader::DatabaseLoader;

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct UserId(pub ID);

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct PersonId(pub ID);

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct PeriodId(pub ID);

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct LocationId(pub ID);

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct SessionId(pub ID);

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct CategoryId(pub ID);

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct NitcEventId(pub String);

pub fn build_schema<A: App + HasDb + HasSqs + Send + Sync + 'static>(
    app: Arc<A>,
) -> Schema<QueryRoot<A>, MutationRoot<A>, EmptySubscription> {
    Schema::build(
        QueryRoot::new(),
        // TODO: stop passing app into MutationRoot, use .data()
        MutationRoot { app: app.clone() },
        EmptySubscription,
    )
    .data(app.clone())
    .finish()
}

pub fn get_dataloader<A: App + HasDb + HasSqs + Send + Sync + 'static>(
    app: Arc<A>,
) -> DataLoader<DatabaseLoader<A>> {
    DataLoader::new(DatabaseLoader::new(app), request_metrics::metrics_spawner)
}
