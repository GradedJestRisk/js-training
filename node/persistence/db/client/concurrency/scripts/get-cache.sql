SELECT
   c.relname,
   count(1) buffer_count,
   pg_size_pretty(count(*) * 1024 * 8) buffer_size
FROM pg_class c
        INNER JOIN pg_buffercache b
                   ON b.relfilenode = c.relfilenode
        INNER JOIN pg_database d
                   ON b.reldatabase = d.oid
WHERE 1=1
  AND d.datname = 'database'
  AND c.relname NOT LIKE 'pg%'
GROUP BY c.relname
