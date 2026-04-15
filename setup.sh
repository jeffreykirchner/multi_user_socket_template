echo "Setup multi user socket template"
sudo service postgresql restart
sudo service redis-server start
echo "Drop template db: enter db password"
dropdb template_experiment -U dbadmin -h localhost -i -p 5432
echo "Create database: enter db password"
createdb -h localhost -p 5432 -U dbadmin -O dbadmin template_experiment
echo "Restore database? (y/n)"
read restore
if [ "$restore" = "y" ]; then
    echo "Restore database: enter db password"
    pg_restore -v --no-owner --role=dbowner --host=localhost --port=5432 --username=dbadmin --dbname=template_experiment database_dumps/template_experiment.sql
else
    python manage.py migrate
    echo "Create Super User:"
    python manage.py setup_superuser_with_profile
    python manage.py setup_site_parameters
    python manage.py loaddata main_sample.json
fi
echo "Setup complete."