'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const {validate} = use('Validator');
const Kelas = use('App/Models/Kela')
const User = use('App/Models/User');
const Materi = use('App/Models/Materi')
const rs = require('randomstring');
const Database = use('Database');
const MateriKelas = use('App/Models/MateriKela')
const QuizKelas = use('App/Models/QuizKela')
const Quiz = use('App/Models/Quiz')
const KontenMateri = use('App/Models/KontenMateri')
const ProgressSiswa = use('App/Models/ProgressSiswa')
const KontenQuiz = use('App/Models/KontenQuiz')
/**
 * Resourceful controller for interacting with kelas
 */
class KelaController {
  /**
   * Show a list of all kelas.
   * GET kelas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, auth}) {
    const user = await User.find(auth.user.id);
    let kelas = {};
    const bg = [
      'bg-red', 'bg-pink', 'bg-purple',
      'bg-deep-purple', 'bg-indigo'
    ];

    if(auth.user.role_id == 3){
      kelas = await Database.select(['kelas.*']).from('kelas_siswas').innerJoin('kelas', 'kelas.id', 'kelas_siswas.kelas_id').where('kelas_siswas.user_id', auth.user.id)
    }else{
      kelas = await user.kelas().fetch()
      kelas = kelas.toJSON()
    }

    const semuaKelas = await Kelas.all()

    return view.render('kelas.index', {kelas: kelas, warna: bg, allKelas: semuaKelas.toJSON()});
  }

  /**
   * Render a form to be used for creating a new kela.
   * GET kelas/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    return view.render('kelas.edit', {title: "Buat Kelas Baru"})
  }

  /**
   * Create/save a new kela.
   * POST kelas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, session, response, auth }) {
    const rules = {
      nama: 'required',
      deskripsi: 'required'
    }

    const validation = await validate(request.all(), rules);

    if(validation.fails()){
      session.withErrors(validation.message()).flashAll();

      return response.redirect('back');
    }

    const {nama, deskripsi} = request.all();

    const kelas = new Kelas();
    kelas.nama = nama;
    kelas.deskripsi = deskripsi;
    kelas.user_id = auth.user.id;
    kelas.token_akses = rs.generate(6);
    await kelas.save();

    return response.route('kelas.show', {id: kelas.id});
  }

  /**
   * Display a single kela.
   * GET kelas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const id = params.id;

    const kelas = await Kelas.find(id);

    const countJumlahSiswa = await Database.from('kelas_siswas').where('kelas_id', id).count('user_id');
    const jumlahSiswa = countJumlahSiswa[0]['count'];

    const materiKelas = await Database.select(['materis.id', 'materis.nama']).from('materi_kelas').innerJoin('materis', 'materis.id', 'materi_kelas.materi_id').where('kelas_id', id);

    const quizKelas = await Database.select(['quizzes.id', 'quizzes.nama']).from('quiz_kelas')
    .innerJoin('quizzes', 'quizzes.id', 'quiz_kelas.quiz_id').where('kelas_id', id);

    const siswas = await Database.select(['users.*']).from('kelas_siswas').innerJoin('users', 'users.id', 'kelas_siswas.user_id').where('kelas_id', id);

    const guru = await User.find(kelas.user_id)

    const allMateri = await Materi.all()
    const allQuiz = await Quiz.all()

    return view.render('kelas.show', {
      data: kelas,
      jumlah_siswa: jumlahSiswa, 
      materi: materiKelas,
      quiz: quizKelas,
      siswa: siswas,
      guru: guru,
      allMateri: allMateri.toJSON(),
      allQuiz: allQuiz.toJSON()
    });
  }

  /**
   * Render a form to update an existing kela.
   * GET kelas/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update kela details.
   * PUT or PATCH kelas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a kela with id.
   * DELETE kelas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async userDaftar({params, request, response, auth}){
    const userId = params.id;

    const { token_akses, kelas_id } = request.all();

    const kelas = await Kelas.find(kelas_id);

    if(kelas.token_akses == token_akses){
      await Database.insert({
        kelas_id: kelas_id,
        user_id: userId
      }).into('kelas_siswas');
      return response.json({status: 1});
    }else{
      return response.json({status: 0});
    }
  }

  async profilSiswa({request, response, auth, params, view}){
    const id = params.id;
    const kelasId = params.kelas;

    const siswa = await User.find(id);
    siswa.tanggal_lahir_siswa = new Date(siswa.tanggal_lahir_siswa).toLocaleDateString();

    const kelas = await Kelas.find(kelasId);

    return view.render('kelas.profil_siswa', {siswa: siswa, kelas: kelas})
  }

  async detailMateriKelas({request, response, auth, params, view}){
    const kelasId = params.id;
    const materId = params.materi;

    const kelas = await Kelas.find(kelasId);

    const materi = await Materi.find(materId);
    const kontenMateri = await Database.from('konten_materis').where('materi_id', materId).orderBy('id', 'asc')

    return view.render('kelas.detail_materi', {kelas: kelas, materi: materi, kontenMateri: kontenMateri});
  }

  async belajarMateri({ request, view, response, auth, params }){
    const kelas = await Kelas.find(params.kelas)
    const materi = await Materi.find(params.materi)
    const kontenMateri = await Database.from('konten_materis').where('materi_id', params.materi).orderBy('id', 'asc')
    const konten = await KontenMateri.find(params.konten)

    return view.render('kelas.materi', {kelas: kelas, materi: materi, kontenMateri: kontenMateri, konten: konten});
  }

  async addMateriKelas({request, response, auth, view}){
    const {kelas_id, materi_id} = request.all()

    const mk = new MateriKelas()
    mk.kelas_id = kelas_id
    mk.materi_id = materi_id
    try{
      await mk.save()

      return response.json({
        status: 1
      })
    }catch(e){
      return response.json({
        status: 0,
        error: e.message
      })
    }
  }
  async addQuizKelas({request, response, auth, view}){
    const {kelas_id, quiz_id} = request.all()

    const mk = new QuizKelas()
    mk.kelas_id = kelas_id
    mk.quiz_id = quiz_id
    try{
      await mk.save()

      return response.json({
        status: 1
      })
    }catch(e){
      return response.json({
        status: 0,
        error: e.message
      })
    }
  }
  async updateToken({request, response, auth, view}){
    const {kelas_id, token_akses} = request.all()

    
    try{
      await Kelas.query().where('id', kelas_id).update({ token_akses: token_akses })

      return response.json({
        status: 1
      })
    }catch(e){
      return response.json({
        status: 0,
        error: e.message
      })
    }
  }

  
  async detailQuizKelas({request, response, auth, params, view}){
    const kelasId = params.id;
    const materId = params.quiz;

    const kelas = await Kelas.find(kelasId);

    const quiz = await Quiz.find(materId);
    const kontenQuiz = await Database.from('konten_quizs').where('quiz_id', materId).orderBy('id', 'asc')

    return view.render('kelas.detail_quiz', {kelas: kelas, quiz: quiz, kontenQuiz: kontenQuiz});
  }

  async belajarQuiz({ request, view, response, auth, params }){
    const kelas = await Kelas.find(params.kelas)
    const quiz = await Quiz.find(params.quiz)
    const kontenQuiz = await Database.from('konten_quizs').where('quiz_id', params.quiz).orderBy('id', 'asc')
    const konten = await KontenQuiz.find(params.konten)

    return view.render('kelas.quiz', {kelas: kelas, quiz: quiz, kontenQuiz: kontenQuiz, konten: konten});
  }
}

module.exports = KelaController
