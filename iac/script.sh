# az login

webapp_name="chapman-experiments-template"
resource_group="RG_ESI_VMs"
app_service_plan='chapman-esi-asp'

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
  --account-name chapmanexperimentsstor \
  --share-name logs \
  --access-key $access_key \
  --mount-path /logs

az webapp log config \
    --name $webapp_name \
    --resource-group $resource_group \
    --web-server-logging filesystem

az webapp identity assign \
    --name $webapp_name \
    --resource-group $resource_group