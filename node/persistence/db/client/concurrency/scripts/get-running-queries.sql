SELECT
    pid,
    SUBSTRING(query,1, 50),
    ssn.state,
    ssn.wait_event_type,
    query_start started_at,
    now() - query_start started_since
FROM pg_stat_activity ssn
WHERE 1=1
  AND ssn.application_name = 'concurrency'
  AND ssn.backend_type = 'client backend'
  AND ssn.pid <>  pg_backend_pid()
;
