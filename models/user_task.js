import Model from './model.js';
import Task from './task.js';
import User from './user.js'
class UserTask extends Model {
  relations() {
    return {
      single: [],
      has_many: [User, Task],
      has_many_through: [],
    }
  }
}

export default UserTask
