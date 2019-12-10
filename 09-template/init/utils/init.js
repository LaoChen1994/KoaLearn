const { query } = require('./query.js');
const readSqlFile = require('./readSqlFile');
const path = require('path');

const initTable = async () => {
  try {
    const sql = await readSqlFile(
      path.resolve(__dirname, '../sql/user-info.sql')
    );
    const data = await query(sql);
    console.log('初始化表单成功!');
  } catch (error) {
    console.log(error);
  }
};

initTable();
