-- No CPU
SELECT id FROM big_table WHERE id = 50000000;

-- CPU
-- SELECT SUM(id) FROM big_table;

-- CPU intensive
-- SELECT *
-- FROM (
--    SELECT MD5(id::TEXT) hash FROM big_table
-- ) t
-- ORDER BY t.hash DESC
-- LIMIT 1;
