'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateRoleSchema extends Schema {
  up () {
    this.create('roles', (table) => {
      table.increments();
      table.string('nama', 50);
    })
  }

  down () {
    this.drop('role')
  }
}

module.exports = CreateRoleSchema
