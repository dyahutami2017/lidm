'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateMateriKelasSchema extends Schema {
  up () {
    this.create('materi_kelas', (table) => {
      table.increments();
      table.integer('kelas_id').references('id').inTable('kelas');
      table.integer('materi_id').references('id').inTable('materis');
    })
  }

  down () {
    this.drop('materi_kelas')
  }
}

module.exports = CreateMateriKelasSchema
