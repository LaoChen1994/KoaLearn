const Koa = require('koa');
const koaBody = require('koa-body');
const router = require('./router/index.js');
const cors = require('koa2-cors');
const koajwt = require('koa-jwt');

const app = new Koa();

app.use(cors({
  origin: function(ctx){
    return 'http://localhost:3000';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 1000,
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  allowMethods: ['GET', 'POST', 'DELETE']
}))

app.use((ctx, next) => {
  return next().catch(err =>　{
    if(err.status === 401){
      ctx.status = 401;
      ctx.body = 'Protected Resource'
    } else {
      throw err;
    }
  })
})

app.use(koajwt({
  secret: 'myToken'
}).unless({path: [/\/login$/ig, /\//ig]}))

app.use(koaBody());

app.use(router.routes(), router.allowedMethods());

app.listen(8000, () => {
  console.log('Server is on 8000');
});
