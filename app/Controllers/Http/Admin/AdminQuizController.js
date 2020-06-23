'use strict'

const Quiz = use('App/Models/Quiz')
const Database = use('Database')
const Route = use('Route')
const crypto = require('crypto')
const Helpers = use('Helpers')
const DB = use('Database')
const KontenQuiz = use('App/Models/KontenQuiz')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with adminquizs
 */
class AdminQuizController {
  /**
   * Show a list of all adminquizs.
   * GET adminquizs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    return view.render('admin.quiz.index')
  }

  async dtIndex({request, response, view}){
    const columns = [
      'id', 'nama', 'banner','actions'
    ];

    const {length, start, order, search, draw} = request.all()

    const limit = length;;
    const ordert = columns[order[0]['column']];
    const dir = order[0]['dir'];
    const count = await Quiz.getCount();
    let countFiltered = count;
    let mData;
    if(search['value'] === ""){
        //default data
        mData = await Database.from('quizzes').select(['id', 'nama', 'banner']).offset(start).limit(limit).orderBy(ordert, dir)
    }else{
        mData = await Database.from('quizzes').select(['id', 'nama', 'count(\'nama\')', 'banner']).offset(start).limit(limit).orderBy(ordert, dir).whereRaw('nama like \'%?%\'', {search})
        countFiltered = mData[0]['count'];
    }
    const data = [];
    if(mData){
        mData.forEach(element => {
          data.push({
            'id': element.id,
            'nama': element.nama,
            'banner': "<img style='width: 80px' src='"+Route.url('asset', {file: element.banner+""})+"'/>",
            'actions': "<a href='" + Route.url("quiz.edit", {id: element.id}) + "' class='btn btn-info'><i class='fa fa-pencil'></i> Ubah</a>&nbsp;&nbsp;<a href='"+Route.url('admin.quiz.soal', {quiz: element.id})+"' class='btn btn-warning'><i class='fa fa-eye'></i> Soal Quiz</a>&nbsp;&nbsp;<button class='btn btn-danger deletequiz'><i class='fa fa-trash'></i> Hapus</button>"
          })
        });
    }
    const json = {
        "draw" : draw,
        "recordsTotal" : count,
        "recordsFiltered" : countFiltered,
        "data" : data
    };
    return response.json(json)
  }

  /**
   * Render a form to be used for creating a new adminquiz.
   * GET adminquizs/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    return view.render('admin.quiz.add')
  }

  /**
   * Create/save a new adminquiz.
   * POST adminquizs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const nama = request.input('nama', null)
    const deskripsi = request.input('deskripsi', null)
    const banner = request.file('banner', {
      types: ['image'],
      size: '2mb'
    })

    const fileName = crypto.createHash('md5').update(new Date().getTime()+nama).digest('hex') + "." + banner.subtype
    await banner.move(Helpers.tmpPath(), {
      name: fileName
    })

    if(!banner.moved()){
      return banner.error()
    }else{
      const quiz = new Quiz()
      quiz.nama = nama;
      quiz.banner = fileName
      quiz.deskripsi = deskripsi
      await quiz.save()
    }

    response.redirect('/admin/quiz')
  }

  /**
   * Display a single adminquiz.
   * GET adminquizs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing adminquiz.
   * GET adminquizs/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
    const quiz = await Quiz.find(params.id)
    return view.render('admin.quiz.edit', {quiz: quiz})
  }

  /**
   * Update adminquiz details.
   * PUT or PATCH adminquizs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const nama = request.input('nama', null)
    const deskripsi = request.input('deskripsi', null)
    const id = params.id
    const banner = request.file('banner', {
      types: ['image'],
      size: '2mb'
    })

    response.send(banner)
    
    const updated = {
      nama: nama,
      deskripsi: deskripsi
    };

    if(banner){
      const fileName = crypto.createHash('md5').update(new Date().getTime()+nama).digest('hex') + "." + banner.subtype
      await banner.move(Helpers.tmpPath(), {
        name: fileName
      })
      updated.banner = fileName
    }

    await Quiz.query().where('id', id).update(updated)

    response.redirect('/admin/quiz')
  }

  /**
   * Delete a adminquiz with id.
   * DELETE adminquizs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async quizIndex({ params, request, response, view }){
    const quizId = params.quiz

    const quiz = await Quiz.find(quizId)
    const soal = await DB.from('konten_quizs').where('quiz_id', quizId)

    return view.render('admin.quiz.soal.index', {quiz: quiz, soal: soal})
  }

  async addQuiz({ params, request, response, view }){
    const quizId = params.quiz
    const quiz = await Quiz.find(quizId)
    return view.render('admin.quiz.soal.add', {quiz: quiz})
  }

  async storeQuiz({params, request, response, view}){
    const { judul, soal, js, css } = request.all();
    const quizId = params.quiz;
    const k = new KontenQuiz()
    k.judul = judul;
    k.soal = soal;
    k.js = js;
    k.quiz_id = quizId;
    k.css = css;
    await k.save()
    return response.route('admin.quiz.soal', {quiz: quizId})
  }

  async detailQuiz({request, response, view, params}){
    const quizId = params.quiz
    const soalId = params.soal

    const soal = await KontenQuiz.find(soalId)

    return view.render('quiz.detail', {soal: soal})
  }

  async editQuiz({request, response, view, params}){
    const quizId = params.quiz
    const soalId = params.soal
    const quiz = await Quiz.find(quizId)
    const soal = await KontenQuiz.find(soalId)
    return view.render('admin.quiz.soal.edit', {quiz: quiz, soal: soal})
  }

  async updateQuiz({params, request, response, view}){
    const { judul, soal, js, css } = request.all();
    const quizId = params.quiz;
    const soalId = params.soal;
    await KontenQuiz.query().where('id', soalId).update({
      judul: judul,
      soal: soal,
      js: js,
      css: css
    })
    return response.route('admin.quiz.soal', {quiz: quizId})
  }
}

module.exports = AdminQuizController
