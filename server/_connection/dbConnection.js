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
        
        const pool = await mysql.createPool({
            host: "172.17.0.3", 
            user: "dbuser", 
            password: "dbuser",
            port: "3306",       
            waitForConnections: true
            
        });

        const ensureSchema = async (pool) => {
            console.log(`Ensured that table 'shule_db' exists`);
            await pool.query(
                `CREATE DATABASE IF NOT EXISTS shule_db;`
            );
        };
      
        const poolPromise = ensureSchema(pool)
            .then(async () => {
                console.log(`Doing database creation`);
                 //connect to db
                 const sequelize = new Sequelize(
                    "shule_db", 
                    "dbuser", 
                    "dbuser", 
                    { 
                        dialect: 'mysql',
                        host: "172.17.0.3"
                        
                    });
                
                //init models and add them to the exported db object
                db.students =  require('../routes/student/student.model')(sequelize);
                db.parents = require('../routes/parent/parent.model')(sequelize);
                db.teachers =  require('../routes/teacher/teacher.model')(sequelize);
                
                
                
                // sync all models with database
                sequelize.sync();
            })
            .catch((err) => {
                console.log(`${err}`)
            });

            poolPromise;
};
        

initialize();