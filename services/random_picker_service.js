import User from '../models/user.js'
import Task from '../models/task.js'
import UserTask from '../models/user_task.js'
class RandomPickerService {
  constructor(task, users) {
    this.task = task
    this.users = users
  }

  static async pick_random(users, task) {
    let a = User.all()
    console.log('🚀 ~ file: random_picker_service.js:12 ~ RandomPickerService ~ pick_random ~ a', a)
    let b = Task.all()
    console.log('🚀 ~ file: random_picker_service.js:14 ~ RandomPickerService ~ pick_random ~ b', b)
    let c = UserTask.all()
    console.log('🚀 ~ file: random_picker_service.js:16 ~ RandomPickerService ~ pick_random ~ c', c)
    // filter through given users to find those with lowest count
    let challengers = this.users_with_lowest_count_for_given_task(users, task)
    // if more than one is found, randomize through those
    let winner = this.get_one_random(challengers)
    return winner
  }

  static async users_with_lowest_count_for_given_task(users, task) {
    let user_tasks = UserTasks.where({ task: task, user: [users] })
    user_tasks.reduce((accumulator, user_task) => {
      accumulator.counter < user_task.counter ? accumulator : user_task
    })
  }

  static async get_one_random(array) {
    return array[Math.floor(Math.random() * array.length)]
  }
}

export default RandomPickerService
