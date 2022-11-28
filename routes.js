const ApplicationController = require('./controllers/application_controller.js')

const mountRoutes = app => {
  app.command('/pick', async ({ ack, payload, client }) => {
    ApplicationController.openPicker(ack, payload, client)
  })
}
module.exports = mountRoutes
