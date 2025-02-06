SELECT
   pg_terminate_backend(pid)
FROM
   pg_stat_activity
WHERE 1=1
  AND pid <> pg_backend_pid()
--   AND datname = 'database'
  AND backend_type = 'client backend'
;

