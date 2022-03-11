# multi_user_socket_template
Template for multi user Django Channels experiment.

Setup Guide:
https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-18-04

local_settings.py:
Rename local_settings_sample.py to local_settings.py
local_settings.py is used for local development and will be excluded from the repo.
Update the database section of this file with the info from your locally run instance of Postgresdb.

Update Python installers:
sudo apt-get install python3-distutils
sudo apt-get install python3-apt

Activate virtual environment and install requirments:
pip install -U -r requirements.txt

Migrate:
python manage.py migrate

Create Super User (user and email should be the same):
python manage.py createsuperuser --username name@abc.edu --email name@abc.edu




