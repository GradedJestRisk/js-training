\timing
DROP TABLE IF EXISTS big_table;
CREATE TABLE big_table( id INTEGER );
-- 2 minutes, 3 GB, 100 millions records
-- INSERT INTO big_table SELECT * FROM generate_series(1, 100000000);
ANALYZE big_table;
SELECT pg_size_pretty (pg_relation_size ('big_table')) AS table_size;
SELECT reltuples::bigint AS table_row_count FROM pg_class where relname = 'big_table';
