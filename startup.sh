echo "*** Startup.sh ***"
echo "Run Migrations:"
python manage.py migrate
echo "Install htop:"
apt-get -y install htop
echo "Start Daphne:"
daphne -b 0.0.0.0 _trade_steal.asgi:application