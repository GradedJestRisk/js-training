-- https://www.cybertec-postgresql.com/en/how-to-interpret-postgresql-explain-analyze-output/
EXPLAIN (VERBOSE, ANALYZE, BUFFERS)
SELECT id
FROM big_table
WHERE id=50000000;
