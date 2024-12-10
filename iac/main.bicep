//az login
//az deployment group create --resource-group RG_ESI_VMs --template-file main.bicep
//az webapp config set -g RG_ESI_VMs -n chapman-experiments-template --startup-file startup.sh

var webSiteName = 'chapman-experiments-template'
var location = resourceGroup().location
var linuxFxVersion = 'PYTHON|3.12'

resource appService 'Microsoft.Web/sites@2020-06-01' = {
    name: webSiteName
    location: location
    properties: {
      serverFarmId: 'chapman-esi-asp'
      siteConfig: {
        linuxFxVersion: linuxFxVersion
      }
      httpsOnly: true
    }
  }
