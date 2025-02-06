SELECT
   SUBSTRING(stt.query,1, 50) query,
   stt.calls,
   stt.rows,
   TRUNC(stt.min_exec_time) min_ms,
   TRUNC(stt.mean_exec_time) mean_ms,
   TRUNC(stt.max_exec_time) max_ms
FROM pg_stat_statements stt
WHERE 1=1
  AND userid = (SELECT oid FROM pg_roles WHERE rolname = 'user')
  AND query NOT ILIKE '%tree%'
  AND query NOT ILIKE '%pg_stat_statements%'
  AND query NOT ILIKE '%pg_buffercache%'
ORDER BY max_exec_time DESC
