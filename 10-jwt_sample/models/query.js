const mysql = require('mysql');
const { config } = require('./config.js');

const pool = mysql.createPool(config);

const queryUserInfo = (username, password) => {
  const sql = `select * from KOA_USER_INFO where username=? and password=?`;
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        connection.query(sql, [username, password], (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      }

      connection.release();
    });
  });
};

module.exports = { queryUserInfo };
