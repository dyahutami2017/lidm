'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuizKelasSchema extends Schema {
  up () {
    this.create('quiz_kelas', (table) => {
      table.increments();
      table.timestamps();
      table.integer('quiz_id').references('id').inTable('quizzes');
      table.integer('kelas_id').references('id').inTable('kelas');
    })
  }

  down () {
    this.drop('quiz_kelas')
  }
}

module.exports = QuizKelasSchema
