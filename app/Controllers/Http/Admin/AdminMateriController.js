'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with adminmateris
 */
const Materi = use('App/Models/Materi')
const KontenMateri = use('App/Models/KontenMateri')
const Database = use('Database')
const Route = use('Route')
const Helpers = use('Helpers')
const crypto = require('crypto')
const DB = use('Database')

class AdminMateriController {
  /**
   * Show a list of all adminmateris.
   * GET adminmateris
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    return view.render('admin.materi.index')
  }

  async dtIndex({request, response, view}){
    const columns = [
      'id', 'nama', 'banner','actions'
    ];

    const {length, start, order, search, draw} = request.all()

    const limit = length;;
    const ordert = columns[order[0]['column']];
    const dir = order[0]['dir'];
    const count = await Materi.getCount();
    let countFiltered = count;
    let mData;
    if(search['value'] === ""){
        //default data
        mData = await Database.from('materis').select(['id', 'nama', 'banner']).offset(start).limit(limit).orderBy(ordert, dir)
    }else{
        mData = await Database.from('materis').select(['id', 'nama', 'count(\'nama\')', 'banner']).offset(start).limit(limit).orderBy(ordert, dir).whereRaw('nama like \'%?%\'', {search})
        countFiltered = mData[0]['count'];
    }
    const data = [];
    if(mData){
        mData.forEach(element => {
          data.push({
            'id': element.id,
            'nama': element.nama,
            'banner': "<img style='width: 80px' src='"+Route.url('asset', {file: element.banner+""})+"'/>",
            'actions': "<a href='" + Route.url("materi.edit", {id: element.id}) + "' class='btn btn-info'><i class='fa fa-pencil'></i> Ubah</a>&nbsp;&nbsp;<a href='"+Route.url('admin.materi.konten', {materi: element.id})+"' class='btn btn-warning'><i class='fa fa-eye'></i> Konten Materi</a>&nbsp;&nbsp;<button class='btn btn-danger deleteMateri'><i class='fa fa-trash'></i> Hapus</button>"
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
   * Render a form to be used for creating a new adminmateri.
   * GET adminmateris/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    return view.render('admin.materi.add')
  }

  /**
   * Create/save a new adminmateri.
   * POST adminmateris
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
      const materi = new Materi()
      materi.nama = nama;
      materi.banner = fileName
      materi.deskripsi = deskripsi
      await materi.save()
    }

    response.redirect('/admin/materi')
  }

  /**
   * Display a single adminmateri.
   * GET adminmateris/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing adminmateri.
   * GET adminmateris/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
    const id = params.id
    const materi = await Materi.find(id)

    return view.render('admin.materi.edit', {materi: materi})
  }

  /**
   * Update adminmateri details.
   * PUT or PATCH adminmateris/:id
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

    await Materi.query().where('id', id).update(updated)

    response.redirect('/admin/materi')
  }

  /**
   * Delete a adminmateri with id.
   * DELETE adminmateris/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async kontenIndex({ params, request, response, view }){
    const materiId = params.materi

    const materi = await Materi.find(materiId)
    const konten = await DB.from('konten_materis').where('materi_id', materiId)

    return view.render('admin.materi.konten.index', {materi: materi, konten: konten})
  }

  async addKonten({ params, request, response, view }){
    const materiId = params.materi
    const materi = await Materi.find(materiId)
    return view.render('admin.materi.konten.add', {materi: materi})
  }

  async storeKonten({params, request, response, view}){
    const { judul, konten, js, css } = request.all();
    const materiId = params.materi;
    const k = new KontenMateri()
    k.judul = judul;
    k.konten = konten;
    k.js = js;
    k.materi_id = materiId;
    k.css = css;
    await k.save()
    return response.route('admin.materi.konten', {materi: materiId})
  }

  async detailKonten({request, response, view, params}){
    const materiId = params.materi
    const kontenId = params.konten

    const konten = await KontenMateri.find(kontenId)

    return view.render('materi.detail', {konten: konten})
  }

  async editKonten({request, response, view, params}){
    const materiId = params.materi
    const kontenId = params.konten
    const materi = await Materi.find(materiId)
    const konten = await KontenMateri.find(kontenId)
    return view.render('admin.materi.konten.edit', {materi: materi, konten: konten})
  }

  async updateKonten({params, request, response, view}){
    const { judul, konten, js, css } = request.all();
    const materiId = params.materi;
    const kontenId = params.konten;
    await KontenMateri.query().where('id', kontenId).update({
      judul: judul,
      konten: konten,
      js: js,
      css: css
    })
    return response.route('admin.materi.konten', {materi: materiId})
  }
}

module.exports = AdminMateriController
