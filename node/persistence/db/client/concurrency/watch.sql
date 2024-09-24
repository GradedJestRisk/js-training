SELECT
    state,
    query
FROM pg_stat_activity prc
WHERE 1=1
    AND prc.backend_type = 'client backend'
    AND prc.application_name = 'concurrency'
ORDER BY prc.state, prc.query ASC
;
\watch
