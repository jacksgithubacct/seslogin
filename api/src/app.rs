use crate::db;
use crate::jwt;
use crate::sqs_dispatch::SqsQueues;

pub trait App {
    fn jwt(&self) -> &jwt::Key;
    fn response_lag(&self) -> u64;
}

pub trait HasDb {
    fn db(&self) -> &impl db::Handler;
}

pub trait HasSqs {
    fn sqs(&self) -> &SqsQueues;
}

/// struct for holding our global singletons
pub struct MyApp<DBH: db::Handler> {
    pub db: DBH,
    pub jwt: jwt::Key,
    pub response_lag: u64,
    pub sqs: SqsQueues,
}

pub fn new<DBH: db::Handler>(
    db: DBH,
    jwt: jwt::Key,
    response_lag: u64,
    sqs: SqsQueues,
) -> MyApp<DBH> {
    MyApp {
        db,
        jwt,
        response_lag,
        sqs,
    }
}

impl<DBH: db::Handler> App for MyApp<DBH> {
    fn jwt(&self) -> &jwt::Key {
        &self.jwt
    }
    fn response_lag(&self) -> u64 {
        self.response_lag
    }
}

impl<DBH: db::Handler> HasDb for MyApp<DBH> {
    fn db(&self) -> &impl db::Handler {
        &self.db
    }
}

impl<DBH: db::Handler> HasSqs for MyApp<DBH> {
    fn sqs(&self) -> &SqsQueues {
        &self.sqs
    }
}
