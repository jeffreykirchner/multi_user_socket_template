echo "setup template"
sudo service postgresql restart
echo "drop template db: enter db password"
dropdb multi_user_socket_template -U dbadmin -h localhost -i
echo "create database: enter db password"
createdb -h localhost -U dbadmin -O dbadmin multi_user_socket_template
source _multi_user_socket_template_env/bin/activate
python manage.py migrate
echo "create super user"
python manage.py createsuperuser 
echo "load fixtures"
python manage.py loaddata main.json
echo "setup done"
python manage.py runserver