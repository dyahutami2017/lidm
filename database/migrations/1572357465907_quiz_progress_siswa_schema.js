'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuizProgressSiswaSchema extends Schema {
  up () {
    this.create('quiz_progress_siswas', (table) => {
      table.increments();
      table.timestamps();
      table.integer('quiz_kelas_id').references('id').inTable('quiz_kelas');
      table.integer('user_id').references('id').inTable('users');
      table.integer('konten_quiz_id').references('id').inTable('konten_quizs');
      table.boolean('status');
    })
  }

  down () {
    this.drop('quiz_progress_siswas')
  }
}

module.exports = QuizProgressSiswaSchema
