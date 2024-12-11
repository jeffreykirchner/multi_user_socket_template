# az login

webapp_name="chapman-experiments-template"
resource_group="RG_ESI_VMs"
resouce_group_db="Experiments"
app_service_plan='chapman-esi-asp'
storage_account='chapmanexperimentsstor'
postgres_server='chapman-experiments-db-v13'

echo "Starting deployment ..."

az deployment group create \
    --resource-group $resource_group\
    --template-file main.bicep \
    --parameters webapp_name=$webapp_name app_service_plan=$app_service_plan

az webapp config set \
    --resource-group $resource_group \
    --name $webapp_name \
    --startup-file startup.sh

echo "Enter connection access key for storage account:"
read access_key

az webapp config storage-account add \
  --resource-group $resource_group \
  --name $webapp_name \
  --custom-id logs \
  --storage-type AzureFiles \
  --account-name $storage_account \
  --share-name logs \
  --access-key $access_key \
  --mount-path /logs

az storage directory create \
    --name $webapp_name \
    --share-name logs \
    --account-name $storage_account \
    --account-key $access_key

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

echo "Enter database admin username:"
read admin_user

echo "Enter database admin password:"
read admin_password

az postgres flexible-server execute --admin-user $admin_user \
                                    --admin-password $admin_password \
                                    --name $postgres_server \
                                    --output table \
                                    --querytext "SELECT datname FROM pg_database;"

