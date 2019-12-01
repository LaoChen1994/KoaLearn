const Router = require('koa-router');
const fs = require('fs');
const queryString = require('querystring');
const bodyParser = require('koa-bodyparser');

const Koa = require('koa');
const app = new Koa();
const apiRouter = new Router();

// use bodyParser for post request
app.use(bodyParser());

const getFileContent = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

// parse post request by hand
const parsePostData = ctx =>
  new Promise((resolve, reject) => {
    try {
      let postData = '';
      ctx.req.addListener('data', data => {
        postData += data;
      });
      console.log(postData);
      ctx.req.addListener('end', () => {
        const obj = queryString.parse(postData);
        resolve(obj);
      });
    } catch (error) {
      console.log(err);
      reject(err);
    }
  });

// get request
apiRouter.get('/getName', async ctx => {
  const { id } = ctx.query;
  const nameList = ['Jack', 'Mike', 'Mary', 'Joe'];

  try {
    ctx.body = {
      name: nameList[+id]
    };
  } catch (error) {
    ctx.body = {
      error
    };
  }
});

// load post form
apiRouter.get('/', async ctx => {
  const html = await getFileContent('./view/post.html');
  ctx.body = html;
});

// post request
apiRouter.post('/postName', async ctx => {
  let postData = await parsePostData(ctx);
  ctx.body = postData;
});

apiRouter.get('/body', async ctx => {
  const html = await getFileContent('./view/bodyParser.html');
  ctx.body = html;
});

// use koa-bodyparser
apiRouter.post('/body/postName', async ctx => {
  let postData = ctx.request.body;
  ctx.body = postData;
});

app.use(apiRouter.routes(), apiRouter.allowedMethods());

app.listen(3000, () => {
  console.log('koa server is running in port 3000');
});
