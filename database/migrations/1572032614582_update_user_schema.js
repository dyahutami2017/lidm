'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdateUserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.string('nama', 80);
      table.integer('role_id').references('id').inTable('roles');
      table.string('foto');
    })
  }

  down () {
    this.table('update_users', (table) => {
      // reverse alternations
      table.dropColumn('nama');
      table.dropColumn('role_id');
      table.dropColumn('foto');
    })
  }
}

module.exports = UpdateUserSchema
