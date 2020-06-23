'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateKontenMateriSchema extends Schema {
  up () {
    this.create('konten_materis', (table) => {
      table.increments();
      table.string('judul', 80);
      table.text('konten');
      table.text('css');
      table.text('js');
      table.boolean('draft');
      table.boolean('publish');
    })
  }

  down () {
    this.drop('konten_materis')
  }
}

module.exports = CreateKontenMateriSchema
