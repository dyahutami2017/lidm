'use strict'

class HomeController {
  index(ctx){
    return ctx.view.render('home.index')
  }
}

module.exports = HomeController
