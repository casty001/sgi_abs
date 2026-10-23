const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',          // tu contraseña de MySQL
  database: 'sgi_abs',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;