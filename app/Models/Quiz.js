'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Quiz extends Model {

    static get table(){
        return 'quizzes';
    }

}

module.exports = Quiz
