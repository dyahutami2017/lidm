'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateKelasSiswaSchema extends Schema {
  up () {
    this.create('kelas_siswas', (table) => {
      table.increments();
      table.integer('user_id').references('id').inTable('users');
      table.integer('kelas_id').references('id').inTable('kelas');
    })
  }

  down () {
    this.drop('kelas_siswas')
  }
}

module.exports = CreateKelasSiswaSchema
