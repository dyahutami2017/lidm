'use strict'

class AdminDashboardController{
  index(ctx){
    return ctx.view.render('admin.dashboard');
  }
}

module.exports = AdminDashboardController
