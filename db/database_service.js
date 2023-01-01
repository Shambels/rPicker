import PostgresConnection from './postgres/connection.js';
import config from 'config';

function create_connection() {
  let management_system = config.get('db.system')

  switch (management_system) {
    case 'postgres':
      return new PostgresConnection(config)
  }
}

export default create_connection
