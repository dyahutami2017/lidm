'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')

class UserSeeder {
  async run () {
    const userAdmin = new User();
    userAdmin.nama = "Tami Dyah";
    userAdmin.email = "tami@medys.com";
    userAdmin.password = "medys90";
    userAdmin.role_id = 1;
    await userAdmin.save();
  }
}

module.exports = UserSeeder
