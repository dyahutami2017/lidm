'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdateUserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.string("nama_siswa", 80);
      table.date("tanggal_lahir_siswa");
      table.string("jenis_kelamin_siswa", 1);
      table.string("foto_siswa");
      table.string('jenis_kelamin_ortu', 1);
      table.string("no_hp");
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
      table.dropColumn('nama_siswa');
      table.dropColumn('tanggal_lahir_siswa');
      table.dropColumn('jenis_kelamin_siswa');
      table.dropColumn('jenis_kelamin_ortu');
      table.dropColumn('foto_siswa');
      table.dropColumn('no_hp');
    })
  }
}

module.exports = UpdateUserSchema
