import Pluralize from 'pluralize';
import dbConnection from '../db/database_service.js';

class Model {
  constructor(attributes) {
    for (let key in attributes) {
      this[key] = attributes[key]
    }
    this.setup_relations()
  }

  static db() {
    return dbConnection()
  }

  static table() {
    return Pluralize(this.name).toLowerCase()
  }

  static async all() {
    let results = await this.db().search(
      this.table(),
      {}
    )

    return results.map(x => new this(x))
  }

  static async where(attributes) {
    let results = await this.db().search(
      this.table(),
      attributes
    )
    if (results.length > 0) {
      return results.map(x => new this(x))
    }
  }

  static async create(attributes) {
    let results = await this.db().insert(this.table(), attributes)
    return new this(attributes)
  }

  static async find(attributes) {
    let results = await this.db().search(
      this.table(),
      attributes,
    )

    if (results.length > 0) {
      return new this(results[0])
    }
  }

  async update(attributes) {
    let results = await this.constructor.db().update(
      this.constructor.table(),
      attributes,
      this.id
    )
    return new this.constructor(results[0])
  }

  async destroy() {
    await this.constructor.db().delete(
      this.constructor.table(),
      [this.id]
    )
    return this
  }

  validate() {
    throw 'undefinedMethod'
  }

  setup_relations() {
    this.belongs_to(this.relations().single)
    this.has_many(this.relations().has_many)
    this.has_many_through(this.relations().has_many_through)
  }

  belongs_to(models) {
    if (typeof (models) == 'undefined') { return }
    models.forEach(model => {
      if (typeof (model) === 'undefined') { return }
      this.define_single_relation_getter(model)
    }
    )
  }

  has_many(models) {
    if (typeof (models) === 'undefined') { return }
    models.forEach(model => {
      if (typeof (model) === 'undefined') { return }
      if (Object.keys(model).length !== 0 || typeof (model) === 'function') {
        this.define_has_many_relation_getter(model)

      }
    })
  }

  has_many_through(relations) {
    if (typeof (relations) === 'undefined') { return }
    relations.forEach(relation => {
      if (typeof (relation) === 'undefined') { return }
      if (Object.keys(relation).length !== 0 || typeof (relation) === 'function') {
        let target_model = relation.target
        let join_model = relation.through
        this.define_has_many_through_relation_getter(target_model, join_model)
      }
    })
  }

  relations() {
    return {}
  }

  async define_single_relation_getter(model) {
    let function_name = model.name.toLowerCase()
    let foreign_key = `${function_name}_id`

    this[function_name] = function () {
      return model.find({ id: this[foreign_key] })
    }
  }

  async define_has_many_relation_getter(model) {
    let function_name = Pluralize(model.name).toLowerCase()
    let foreign_key = `${this.constructor.name.toLowerCase()}_id`
    let dict = {}
    dict[foreign_key] = this.id

    this[function_name] = function () {
      return model.where(dict)
    }
  }

  async define_has_many_through_relation_getter(target_model, join_model) {
    let function_name = Pluralize(target_model.name).toLowerCase()
    let self_key = `${this.constructor.name.toLowerCase()}_id`
    let target_key = `${target_model.name.toLowerCase()}_id`
    let dict = {}
    dict[self_key] = this.id


    this[function_name] = async function () {
      let join_matches = await join_model.where(dict)
      if (typeof(join_matches) === 'undefined') { return;}

      let target_ids = await Promise.all(join_matches.map(async x => await x[target_key]))
      return target_model.where({ id: target_ids })
    }
  }
}

export default Model
