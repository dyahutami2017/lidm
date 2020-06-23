'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KelasSchema extends Schema {
  up () {
    this.table('kelas', (table) => {
      table.timestamps();
    })
  }

  down () {
    this.table('kelas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = KelasSchema
