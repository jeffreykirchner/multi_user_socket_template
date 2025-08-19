#!/bin/bash
# az login

webapp_name=$(jq . "secrets.json" |  jq -r '.webapp_name')
resource_group=$(jq . "secrets.json" |  jq -r '.resource_group')
resource_group_db=$(jq . "secrets.json" |  jq -r '.resource_group_db')
app_service_plan=$(jq . "secrets.json" |  jq -r '.app_service_plan')
storage_account=$(jq . "secrets.json" |  jq -r '.storage_account')
postgres_server=$(jq . "secrets.json" |  jq -r '.postgres_server')
db_admin_user=$(jq . "secrets.json" |  jq -r '.db_admin_user')
db_admin_password=$(jq . "secrets.json" | jq -r '.db_admin_password')
sa_access_key=$(jq . "secrets.json" |  jq -r '.sa_access_key' )
db_name=$(jq . "secrets.json" |  jq -r '.db_name')
db_pass=$(jq . "secrets.json" |  jq -r '.db_pass')
db_user=$(jq . "secrets.json" |  jq -r '.db_user')

echo "Starting deployment ..."

az deployment group create \
    --resource-group $resource_group\
    --template-file main.bicep \
    --parameters webapp_name=$webapp_name app_service_plan=$app_service_plan

az webapp config set \
    --resource-group $resource_group \
    --name $webapp_name \
    --startup-file startup.sh

az webapp config storage-account add \
  --resource-group $resource_group \
  --name $webapp_name \
  --custom-id logs \
  --storage-type AzureFiles \
  --account-name $storage_account \
  --share-name logs \
  --access-key $sa_access_key \
  --mount-path /logs

az storage directory create \
    --name $webapp_name \
    --share-name logs \
    --account-name $storage_account \
    --account-key $sa_access_key

az webapp log config \
    --name $webapp_name \
    --resource-group $resource_group \
    --web-server-logging filesystem

az webapp identity assign \
    --name $webapp_name \
    --resource-group $resource_group

az webapp config appsettings set \
    --name $webapp_name \
    --resource-group $resource_group \
    --settings "@environment_variables.json"

az webapp config appsettings list \
    --name $webapp_name \
    --resource-group $resource_group

az postgres flexible-server execute --admin-user $db_admin_user \
                                    --admin-password $db_admin_password \
                                    --name $postgres_server \
                                    --output table \
                                    --querytext "CREATE USER ${db_user} WITH ENCRYPTED PASSWORD '${db_pass}';"

az postgres flexible-server execute --admin-user $db_admin_user \
                                    --admin-password $db_admin_password \
                                    --name $postgres_server \
                                    --output table \
                                    --querytext "CREATE DATABASE ${db_name};"

az postgres flexible-server execute --admin-user $db_admin_user \
                                    --admin-password $db_admin_password \
                                    --name $postgres_server \
                                    --output table \
                                    --querytext "GRANT CONNECT ON DATABASE ${db_name} TO ${db_user};"

az postgres flexible-server execute --admin-user $db_admin_user \
                                    --admin-password $db_admin_password \
                                    --name $postgres_server \
                                    --database-name $db_name \
                                    --output table \
                                    --querytext "GRANT USAGE ON SCHEMA public TO ${db_user};"

az postgres flexible-server execute --admin-user $db_admin_user \
                                    --admin-password $db_admin_password \
                                    --name $postgres_server \
                                    --database-name $db_name \
                                    --output table \
                                    --querytext "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${db_user};"

az postgres flexible-server execute --admin-user $db_admin_user \
                                    --admin-password $db_admin_password \
                                    --name $postgres_server \
                                    --database-name $db_name \
                                    --output table \
                                    --querytext "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${db_user};"

echo "Deployment completed successfully, manually setup source code in the Deployment Center."
echo "Once the source code is setup, run iac/script_post_deployment.sh in ssh to complete the deployment."