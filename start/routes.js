'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

//Route.on('/').render('welcome')
Route.get('/', 'HomeController.index');

//Dashboard Routing Group
Route.group(() => {
  Route.get('/', 'DashboardController.index');
}).prefix('dashboard').middleware(['adminAuth']);

Route.group(() => {
  Route.get('/login', 'UserController.login').as('user.login');

}).prefix('user');
