-- https://www.cybertec-postgresql.com/en/pg_stat_statements-the-way-i-like-it/
SELECT substring(regexp_replace(query, E'[\\n\\r]+', ' ', 'g' ), 1, 50) AS inlined_query,
       round(total_exec_time::numeric, 2) AS total_exec_time,
       calls,
       TRUNC(stt.min_exec_time) min_ms,
       TRUNC(stt.max_exec_time) max_ms,
       round(mean_exec_time::numeric, 2) AS mean_ms,
       round((100 * total_exec_time /
              sum(total_exec_time::numeric) OVER ())::numeric, 2) AS percentage_cpu
FROM pg_stat_statements stt
WHERE 1=1
  AND userid = (SELECT oid FROM pg_roles WHERE rolname = 'user')
  AND query NOT ILIKE '%tree%'
  AND query NOT ILIKE '%pg_stat_statements%'
  AND query NOT ILIKE '%pg_buffercache%'
ORDER BY max_exec_time DESC
LIMIT 20;
