'use strict'

class ForumController {
    async all({view}){
        return view.render('forum.all')
    }

    async detail({view}){
        return view.render('forum.detail')
    }
}

module.exports = ForumController
