```shell
npm run start-container
POSTGRESQL_EXPOSED_PORT=5434 npm run configure-database
POSTGRESQL_EXPOSED_PORT=5434 npm run create-big-table
POSTGRESQL_EXPOSED_PORT=5434 npm run select-big-table-many-times-twenty-clients
```


single
```text
                   inlined_query                    | total_exec_time | calls | min_ms | max_ms | mean_ms  | percentage_cpu
----------------------------------------------------+-----------------+-------+--------+--------+----------+----------------
 INSERT INTO big_table SELECT * FROM generate_serie |        32506.91 |     1 |  32506 |  32506 | 32506.91 |           7.40
 SELECT id FROM big_table WHERE id = $1             |       406570.69 |    20 |  14805 |  22625 | 20328.53 |          92.52
```

multi
```text
                   inlined_query                    | total_exec_time | calls | min_ms | max_ms | mean_ms | percentage_cpu
----------------------------------------------------+-----------------+-------+--------+--------+---------+----------------
 INSERT INTO big_table SELECT * FROM generate_serie |         7665.63 |     1 |   7665 |   7665 | 7665.63 |           8.62
 SELECT id FROM big_table WHERE id = $1             |        80902.00 |    20 |   1819 |   4941 | 4045.10 |          90.99
 ANALYZE big_table                                  |          344.84 |     1 |    344 |    344 |  344.84 |           0.39

```
