'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use('App/Models/Role')

class RoleSeeder {
  async run () {
    const r1 = new Role();
    r1.id = 1;
    r1.nama = "Administrator";
    await r1.save();
    const r2 = new Role();
    r2.id = 2;
    r2.nama = "Guru";
    await r2.save();
    const r3 = new Role();
    r3.id = 3;
    r3.nama = "Pengguna";
    await r3.save();
  }
}

module.exports = RoleSeeder
