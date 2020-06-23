'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Kela extends Model {
    siswa(){
        return this.hasMany('App/Models/User', 'id', 'user_id');
    }
}

module.exports = Kela
