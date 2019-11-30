const Koa = require('koa');
const app = new Koa();
const { handleRouter } = require('./middleware/router.js');

app.use(handleRouter);

app.listen(5000, () => {
  console.log('start at port 5000');
});
