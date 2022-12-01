class RandomPickerService {
  constructor(task, users) {
    this.task = task
    this.users = users
  }

  pick_random(users, task) {
    // filter through given users to find those with lowest count
    let challengers = this.users_with_lowest_count_for_given_task(users, task)
    // if more than one is found, randomize through those
    let winner = this.get_one_random(challengers)
    return winner
  }

  users_with_lowest_count_for_given_task(users, task) {
    let user_tasks = UserTasks.where({ task: task, user: [users] })
    user_tasks.reduce((accumulator, user_task) => {
      accumulator.counter < user_task.counter ? accumulator : user_task
    })
  }

  get_one_random(array) {
    return array[Math.floor(Math.random() * array.length)]
  }
}

export default RandomPickerService
