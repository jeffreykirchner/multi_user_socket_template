# Multi-User Django Websocket Template
Template for a multi-user Django Channels experiment.

## Local setup on Windows:

<p>Install Visual Studio Code with WSL: https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode<br>
Open VS Code, activate WSL, and create a new folder.<br>
Clone this repo into the new folder using the command:
	
```
git clone https://github.com/jeffreykirchner/multi_user_socket_template.git .
```
 
Install PostgreSQL and REDIS in WSL: https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database<br>
</p>

local_settings.py:
    Copy local_settings_sample.py to local_settings.py
    local_settings.py is used for local development and will be excluded from the repo.
    Update the database section of this file with the info from your locally run instance of Postgresdb.

Update Python installers:
	sudo add-apt-repository ppa:deadsnakes/ppa
	sudo apt update 
	sudo apt install python3.11
	sudo apt-get install python3.11-distutils

Activate virtual environment and install requirments:
    virtualenv --python=python3.11 _multi_user_socket_template_env
    source _multi_user_socket_template_env/bin/activate
    pip install -U -r requirements.txt

Setup Environment:
sh setup.sh

Run Environment:
python manage.py runserver






