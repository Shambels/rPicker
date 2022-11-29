const ApplicationController = require('./controllers/application_controller.js')

const mountRoutes = app => {
  app.command('/pick', async ({ ack, payload, client }) => {
    ApplicationController.openPicker(ack, payload, client)
  })

  app.options('task_select-action', async ({ ack, payload, client }) => {
    ApplicationController.loadTasks(ack, payload, client)
  })

  app.view('modal_input_callback_id', async ({ ack, body, view }) => {
    ApplicationController.submitModal(ack, app, view)
  })
  
}
module.exports = mountRoutes
