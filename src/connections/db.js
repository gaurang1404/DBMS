import mysql from 'mysql2';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2414',
    database: 'hospital',
    port: '3307'
});

export default db;
