const _ = require('lodash');

const mysql = require('mysql');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'koa_demo'
});

const queryAllBookInfo = connection => {
  connection.query('select * from book', (err, res, field) => {
    res.map(elem => {
      console.log(
        _.join(
          [
            elem.book_id,
            elem.book_title,
            elem.book_author,
            elem.book_submission_date
          ],
          '  '
        )
      );
    });
  });
  connection.release();
};

const addBook = (connection, book) => {
  const { book_title, book_author, book_submission_date } = book;
  connection.query(
    'insert into book(book_title,book_author,book_submission_date) values(?,?,?);',
    [book_title, book_author, book_submission_date],
    (err, res, fields) => {
      console.log(err);
      console.log(res);
      console.log(fields);
    }
  );
};

pool.getConnection((err, connection) => {
  queryAllBookInfo(connection);
  addBook(connection, {
    book_title: '海底历险记',
    book_author: '西瓜',
    book_submission_date: '1980-7-12'
  });
});
