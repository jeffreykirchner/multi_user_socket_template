echo "*** Startup.sh ***"
apt-get update
echo "Run Migrations:"
python manage.py migrate
echo "Install htop:"
apt-get -y install htop
echo "Install redis"
apt-get -y install redis
echo "Start Server:"
redis-server & daphne -b 0.0.0.0 _multi_user_socket_template.asgi:application