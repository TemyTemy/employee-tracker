const mysql = require('mysql');
function doConnect() {
    return mysql.createConnection({
        host: 'localhost',
      
        // Your port; if not 3306
        port: 3306,
      
        // Your username
        user: 'root',
      
        // Be sure to update with your own MySQL password!
        password: 'bootcamp21##@',
        database: 'employee_db'
    });
} 

const dbutil = {
    connect: () => {
        const connection = doConnect();
        connection.connect((err) => {
            if (err) throw err;    
        });
        return connection;
    },
    close: () => {
        connection.end();
    }
}

module.exports = dbutil;