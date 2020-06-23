'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateKelasSchema extends Schema {
  up () {
    this.create('kelas', (table) => {
      table.increments();
      table.string('nama', 80);
      table.integer('user_id').references('id').inTable('users');
      table.text('deskripsi');
      table.varchar('token_akses');
    })
  }

  down () {
    this.drop('kelas')
  }
}

module.exports = CreateKelasSchema
