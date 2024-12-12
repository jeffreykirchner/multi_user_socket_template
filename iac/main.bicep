
param webapp_name string
param app_service_plan string

var linux_fx_version = 'PYTHON|3.12'

resource appService 'Microsoft.Web/sites@2020-06-01' = {
  name: webapp_name
  location:  resourceGroup().location
  properties: {
    serverFarmId: app_service_plan
    siteConfig: {
      linuxFxVersion: linux_fx_version
    }
    httpsOnly: true
    clientAffinityEnabled: false
  }
  tags: {
    Owner: 'ESI'
  }
}
