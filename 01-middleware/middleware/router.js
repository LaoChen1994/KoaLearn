const fs = require('fs');

async function handleReq(ctx, next) {
  ctx.body = ctx.req.url.replace(/(\/)/gi, ' ');
  await next();
}

const readFile = path =>
  new Promise((resolve, reject) =>
    fs.readFile(path, 'utf-8', (err, data) =>
      err ? reject(err) : resolve(data)
    )
  );

async function handleRouter(ctx, next) {
  let { url } = ctx.req;
  url = url.slice(1);
  const filename = `view/${['index', 'todo'].includes(url) ? url : '404'}.html`;
  const data = await readFile(filename);
  ctx.body = data;

  await next();
}

module.exports = { handleReq, handleRouter };
