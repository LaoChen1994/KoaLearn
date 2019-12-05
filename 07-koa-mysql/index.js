const mysql = require('mysql');
const { query } = require('./async-db.js');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'koa_demo'
});

// 建立一次的简单连接
// connection.connect();

// connection.query('select * from book', (err, res, fields) => {
//   if (err) throw err;
//   const e = res[0];
// });

// connection.end();

// 使用async/await进行封装
async function getAll() {
  const sql = 'select * from book';
  const data = await query(sql);
  data.map(elem =>
    console.log(
      `${elem.book_id} ${elem.book_title} ${elem.book_author} ${elem.book_submission_date}`
    )
  );
}

getAll();
