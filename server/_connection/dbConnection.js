const config = require('dbConfig.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');


module.exports = db = {
    students: this.students,
    teachers: this.teachers,
    parents: this.parents
};


async function initialize() {
    // create db if it doesn't already exist
    // const { host, user, password, database, socketPath, port } = config.database;
    // const connection = await mysql.createConnection(
    //     { 
    //         host: process.env.DB_HOST, 
    //         user: process.env.DB_USER, 
    //         password: process.env.DB_PASS,
    //         database: process.env.DB_NAME,
    //         socketPath: process.env.SOCKET_PATH,
    //         port: process.env.DB_PORT
            
    //     });
    //     await connection.connect((err) => {
    //         if(err) {
    //             console.log(err.code);
    //             console.log(err.fatal);
    //         }
    //     });
        
        var pool = await mysql.createPool({
            host: process.env.DB_HOST, 
            user: process.env.DB_USER, 
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        
        await pool.getConnection(function(err, connecton) {
                if (err) {
                    console.log(`connection error: ${err}`)
                }
                connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`, () => {
                    //connect to db
                    const sequelize = new Sequelize(
                        process.env.DB_NAME, 
                        process.env.DB_USER, 
                        process.env.DB_PASS, 
                        { 
                            dialect: 'mysql',
                            host: '/cloudsql/shule-db',
                            timestamps: false,
                            dialectOptions: {
                                socketPath: '/cloudsql/shule-db'
                            } 
                        });
                    
                    //init models and add them to the exported db object
                    db.students =  require('../routes/student/student.model')(sequelize);
                    db.parents = require('../routes/parent/parent.model')(sequelize);
                    db.teachers =  require('../routes/teacher/teacher.model')(sequelize);
                    
                    
                    
                    // sync all models with database
                sequelize.sync();
                connection.release();
            });

        });

        await pool.end((err) => {
            console.log("Pool Connection closed!");
        })
    };

initialize();