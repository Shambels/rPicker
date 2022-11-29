const modal_input = require('../views/modal_input.json')
const tasks = require('../views/tasks.json')
const RandomPickerService = require('../services/random_picker_service.js')
class ApplicationController {
  static async openPicker(ack, payload, client) {
    ack()
    client.views.open({
      view: modal_input,
      trigger_id: payload.trigger_id
    })
  }

  static async loadTasks(ack, payload, client) {
    let matching_options = []
    for (let option in tasks.options) {
      let value = tasks.options[option]['value'].toLowerCase()
      let text = tasks.options[option]['text']['text'].toLowerCase()
      let input = payload.value.toLowerCase()

      if(value.startsWith(input) || text.startsWith(input)) {
        matching_options.push(tasks.options[option])
      }
    }

      await ack({
        "options": matching_options
      });
  }

  static async submitModal(ack, app, view) {
    let values = view.state.values

    let task = values['task_select_input']['task_select-action']['selected_option']['value']
    let users = values['users_select_input']['users_select-action']['selected_users'].map(user => {
      return `<@${user}>`
    })

    // Task.find(task)
    // users.where(users)

    // let winner = RandomPickerService.pick_random(users, task)

    let winner = "<@U04CKVCPWCA>"
    let message = `task =${task}, users = ${users}, winner=${winner}`

    let blocks = require('../views/results.json')
    // console.log("🚀 ~ file: application_controller.js ~ line 38 ~ ApplicationController ~ submitModal ~ message", message)
    app.client.chat.postMessage(
      {
        channel: "general",
        blocks: blocks
        // text: message
      })
    await ack();
  }
}

module.exports = ApplicationController
