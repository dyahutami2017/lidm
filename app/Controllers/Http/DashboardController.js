'use strict'

class DashboardController {
  index(ctx){
    return ctx.view.render('dashboard.index');
  }
}

module.exports = DashboardController
