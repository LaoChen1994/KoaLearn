const Router = require('koa-router');

const router = new Router();

const homeRouter = require('./home.js');
const errRouter = require('./error.js');
const loginRouter = require('./login.js');

router.use('/', homeRouter.routes(), homeRouter.allowedMethods());
router.use('/err', errRouter.routes(), errRouter.allowedMethods());
router.use('/login', loginRouter.routes(), loginRouter.allowedMethods());

module.exports = router;
