# Multi-User Django Websocket Template
Template for a multi-user Django Channels experiment.

## Local setup on Windows:

Install Visual Studio Code with WSL: https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode<br>
Open VS Code, activate WSL, and create a new folder.<br>
Clone this repo into the new folder using the command:
	
```
cd new_folder_name
git clone https://github.com/jeffreykirchner/multi_user_socket_template.git .
```

Install PostgreSQL and REDIS in WSL: https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database<br>

Set up PostgreSQL in WSL:
```
create user dbadmin with encrypted password 'password_here';
create database multi_user_socket_template with owner dbadmin;
```

## Project Setup
### local_settings.py:
Rename local_settings_sample.py to local_settings.py<br>
local_settings.py is used for local development and is excluded from the repo<br>.
Update the database section of this file with the info from your locally run instance of PostgreSQL.

### Python and Virtual Environment Setup:
Install Python 3.12:
```
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update 
sudo apt install python3.12
sudo apt-get install python3.12-distutils
```

Install Virtual Environment:
```
sudo apt install pipx
pipx install virtualenv
virtualenv --python=python3.12 _project_env
source _project_env/bin/activate
pip install -r requirements.txt

//deactivate virtual environment
deactivate
```

### Setup Django Project:
When asked to restore the database, select "No".
```
sh setup.sh
python manage.py runserver
```

Navigate to http://localhost:8000 in your browser to see the project running.<br>
Log in with the email and password you created in the previous step.






