'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateProgressSiswaSchema extends Schema {
  up () {
    this.create('progress_siswas', (table) => {
      table.increments();
      table.integer('materi_kelas_id').references('id').inTable('materi_kelas');
      table.integer('user_id').references('id').inTable('users');
      table.integer('konten_materi_id').references('id').inTable('konten_materis');
    })
  }

  down () {
    this.drop('progress_siswas')
  }
}

module.exports = CreateProgressSiswaSchema
