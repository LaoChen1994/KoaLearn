const mysql = require('mysql');
const config = require('../config');

const pool = mysql.createPool(config);

let query = (sql, values) =>
  new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        connection.query(sql, values, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      }
    });
  });

module.exports = { query };
