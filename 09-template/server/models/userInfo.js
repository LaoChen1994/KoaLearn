const { query } = require('../../init/utils/query');

const addUser = (username, password, email) => {
  const sql =
    'insert into KOA_USER_INFO(username,password,email) values(?,?,?)';
  return query(sql, [username, password, email]);
};

const searchUserByName = username => {
  const sql = `select * from KOA_USER_INFO where username=?`;
  return query(sql, [username]);
};

module.exports = {
  addUser,
  searchUserByName
};
