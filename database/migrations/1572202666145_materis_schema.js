'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MaterisSchema extends Schema {
  up () {
    this.table('materis', (table) => {
      table.timestamps();
    })
  }

  down () {
    this.table('materises', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MaterisSchema
