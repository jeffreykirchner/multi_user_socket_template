echo "setup multi user socket template"
sudo service postgresql restart
echo "drop template db: enter db password"
dropdb multi_user_socket_template -U dbadmin -h localhost -i -p 5433
echo "create database: enter db password"
createdb -h localhost -p 5433 -U dbadmin -O dbadmin multi_user_socket_template
echo "restore database: enter db password"
pg_restore -v --no-owner --role=dbowner --host=localhost --port=5433 --username=dbadmin --dbname=multi_user_socket_template database_dumps/multi_user_socket_template.sql