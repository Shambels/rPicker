const modal_input = require('../views/modal_input.json')

class ApplicationController {
  static async openPicker(ack, payload, client) {
    ack()
    client.views.open({
      view: modal_input,
      trigger_id: payload.trigger_id
    })
  }
}

module.exports = ApplicationController
