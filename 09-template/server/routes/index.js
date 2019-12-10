const Router = require('koa-router');

const router = new Router();

const homeRouter = require('./home.js');
const errRouter = require('./error.js');
const loginRouter = require('./login.js');
const apiRouter = require('./api.js');

router.use('/', homeRouter.routes(), homeRouter.allowedMethods());
router.use('/err', errRouter.routes(), errRouter.allowedMethods());
router.use('/login', loginRouter.routes(), loginRouter.allowedMethods());
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

module.exports = router;
