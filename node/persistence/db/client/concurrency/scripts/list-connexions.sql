SELECT datname database_name, COUNT(1)
FROM pg_stat_activity
WHERE backend_type = 'client backend'
GROUP BY datname;
