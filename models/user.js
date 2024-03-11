import Model from './model.js';
import Task from './task.js';
import UserTask from './user_task.js';
class User extends Model {
  relations() {
    return {
      single: [],
      has_many: [],
      has_many_through: [{ target: Task, through: UserTask }],
    }
  }
}

export default User
