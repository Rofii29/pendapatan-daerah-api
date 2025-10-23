const oracledb = require('oracledb');

async function getConnection() {
  return await oracledb.getConnection({
    user: 'system',
    password: 'Rofii292003',
    connectString: 'localhost/XE'  // atau localhost/XEPDB1 tergantung hasil `lsnrctl status`
  });
}

module.exports = getConnection;
