const { query } = require('./query.js.js');
const sql = require('../sql/user-info.sql');

const initTable = async () => {
  try {
    const data = await query(sql);
    console.log('初始化表单成功!');
  } catch (error) {
    console.log(error);
  }
};

initTable();
