'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateMateriSchema extends Schema {
  up () {
    this.create('materis', (table) => {
      table.increments();
      table.string('nama', 80);
      table.string('banner');

    })
  }

  down () {
    this.drop('materis')
  }
}

module.exports = CreateMateriSchema
