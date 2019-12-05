const mysql = require('mysql');
const { mysqlConfig } = require('./config.js');

const pool = mysql.createPool(mysqlConfig);

let query = (sql, values) =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, res, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }

          connection.release();
        });
      }
    });
  });

module.exports = { query };
