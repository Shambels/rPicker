import pg from 'pg';
const { Pool, Client } = pg
class PostgresConnection {
  constructor(config) {
    this.config = config
    this.client = this.getClient(config)
  }

  async search(table, fields) {
    let fields_values = Object.values(fields).flat()
    let results = await this.client.query({
      text: this.get_search_query_string(table, fields),
      values: fields_values,
    })
    return this.parseResults(results)
  }

  async insert(table, fields) {
    let fields_values = Object.values(fields)
    let results = await this.client.query(this.get_insert_query_string(table, fields), fields_values)
    return this.parseResults(results)
  }

  async update(table, fields, _id) {
    let fields_values = Object.values(fields)
    let results = await this.client.query(this.get_update_query_string(table, fields, _id), fields_values)
    return this.parseResults(results)
  }

  async delete(table, ids) {
    let results = await this.client.query(this.get_delete_query_string(table, ids))
    return this.parseResults(results)
  }

  //  PRIVATE

  getClient(config) {
    let threadCount = config.get('db.threads')
    if (threadCount > 1) {
      return new Pool({
        user: config.get('db.user'),
        host: config.get('db.host'),
        database: config.get('db.database'),
        password: config.get('db.password'),
        port: config.get('db.port'),
        max: config.get('db.threads')
      });
    } else {
      return new Client({
        user: config.get('db.user'),
        host: config.get('db.host'),
        database: config.get('db.database'),
        password: config.get('db.password'),
        port: config.get('db.port'),
      });
    }
  }

  get_search_query_string(table, fields) {
    let fields_keys = Object.keys(fields)
    let fields_values = Object.values(fields)
    let str = `SELECT * FROM '${table}'`
    if (fields_keys.length == 0) { return str }

    str += ` WHERE `

    let values_index = 1
    for (let i = 0; i < fields_values.length; i++) {
      let field_value = fields_values[i]
      if (Array.isArray(field_value)) {
        str += field_value.map(value => {
          let condition = `'${table}'.'${fields_keys[i]}' = $${values_index}`
          values_index++;
          return condition
        }).join(' OR ');
      } else {
        if (i > 0) {
          str += ' AND '
        }
        str += `'${table}'.'${fields_keys[i]}' = $${values_index}`
        values_index++;
      }
    }

    return str
  }

  get_insert_query_string(table, fields) {
    let fields_keys = Object.keys(fields)
    if (fields_keys.length == 0) return
    let str = `INSERT INTO ${table}(${fields_keys.join(', ')}) VALUES (${this.get_values_indexes_string(fields_keys)}) RETURNING *`
    return str
  }

  get_values_indexes_string(fields_keys) {
    return fields_keys.map(function (key, index) {
      return `$${index + 1}`;
    }).join(', ');
  }

  get_update_query_string(table, fields, _id) {
    let fields_keys = Object.keys(fields)
    if (fields_keys.length == 0) return

    let str = `UPDATE ${table} SET `
    str += fields_keys.map((key, index) => { return `${key} = $${index + 1}` }).join(', ')

    if (_id == null) { return str }

    str += ` WHERE id = ${_id}`

    return str
  }

  get_delete_query_string(table, ids) {
    let str = `DELETE FROM ${table}`
    if (ids.length === 0) return str

    str += ` WHERE id IN (${ids.join()})`

    return str
  }

  parseResults(results) {
    if (results.rowCount == 0) {
      // TODO  hhandle search with no match gracefully
      //  throw 'NoMatchFound'
    }
    return results.rows
  }
}

export default PostgresConnection
