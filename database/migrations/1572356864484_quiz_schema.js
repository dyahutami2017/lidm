'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuizSchema extends Schema {
  up () {
    this.create('quizzes', (table) => {
      table.increments();
      table.timestamps();
      table.string('nama', 80);
      table.string('banner', 80);
    })
  }

  down () {
    this.drop('quizzes')
  }
}

module.exports = QuizSchema
