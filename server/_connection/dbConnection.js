const config = require('dbConfig.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {
    students: this.students,
    teachers: this.teachers,
    parents: this.parents
};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    //connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    //init models and add them to the exported db object
     db.students =  require('../routes/student/student.model')(sequelize);
     db.parents = require('../routes/parent/parent.model')(sequelize);
     db.teachers =  require('../routes/teacher/teacher.model')(sequelize);
    
     

    // sync all models with database
    await sequelize.sync();
}