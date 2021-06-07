DROP TABLE IF EXISTS statement_statistic;
DROP TABLE IF EXISTS statement;

CREATE TABLE statement (
    id TEXT PRIMARY KEY,
    text TEXT
);

CREATE TABLE statement_statistic (
    statement_id    TEXT REFERENCES statement (id),
    calls           INTEGER,
    rows            INTEGER,
    total_time      NUMERIC,
    mean_time       NUMERIC,
    min_time        NUMERIC,
    max_time        NUMERIC,
    time_stddev     NUMERIC,
    created_at      TIMESTAMP DEFAULT NOW()
 );

