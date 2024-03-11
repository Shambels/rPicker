import Model from './model.js';
import User from './user.js';
import UserTask from './user_task.js';
class Task extends Model {
  relations() {
    return {
      single: [],
      has_many: [],
      has_many_through: [{ target: User, through: UserTask }],
    }
  }
}

export default Task
