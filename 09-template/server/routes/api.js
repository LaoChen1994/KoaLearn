const Router = require('koa-router');
const router = new Router();
const UserController = require('../controllers/UserController.js');

router.post('/login', UserController.handleLogin);
router.post('/register', UserController.handleRegister);

module.exports = router;
