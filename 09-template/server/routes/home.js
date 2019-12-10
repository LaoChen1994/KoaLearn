const homeRouter = require('koa-router')();
const HomeController = require('../controllers/HomeController.js');

homeRouter.get('/', HomeController.getHomeIndex);

module.exports = homeRouter;
