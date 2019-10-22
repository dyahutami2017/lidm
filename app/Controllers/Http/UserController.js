'use strict'

class UserController {
  login(ctx){
    return ctx.view.render('user.login');
  }
}

module.exports = UserController
