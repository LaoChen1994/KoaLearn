const Router = require('koa-router');
const router = new Router();
const api = require('./api.js');

router.use('/api', api.routes(), api.allowedMethods());

module.exports = router;
