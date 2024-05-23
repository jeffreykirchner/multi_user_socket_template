echo "Dump Database"
pg_dump --host=localhost --port=5432 --username=dbadmin --dbname=multi_user_socket_template --file=database_dumps/multi_user_socket_template.sql -v -Fc