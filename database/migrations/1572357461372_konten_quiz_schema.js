'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KontenQuizSchema extends Schema {
  up () {
    this.create('konten_quizs', (table) => {
      table.increments();
      table.timestamps();
      table.integer('quiz_id').references('id').inTable('quizzes');
      table.text('content');
      table.text('js');
      table.text('css');
      table.boolean('draft');
      table.boolean('publish')
    });
  }

  down () {
    this.drop('konten_quizs')
  }
}

module.exports = KontenQuizSchema
