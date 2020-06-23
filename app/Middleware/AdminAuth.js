'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AdminAuth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ ctx, auth, response }, next) {
    // call next to advance the request
      try {
        await auth.check();
        if(auth.user.role_id > 1){
          return response.route('home')
        }
      }catch (e) {
        return response.route('admin.login')
      }

    await next()
  }
}

module.exports = AdminAuth
