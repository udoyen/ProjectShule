//const config = require("dbConfig.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {
  students: this.students,
  teachers: this.teachers,
  parents: this.parents,
};

async function initialize() {
  // create db if it doesn't already exisT
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.PORT,
    waitForConnections: true,
  });

  const ensureSchema = async (pool) => {
    console.log(`Ensured that table ${process.env.DB_NAME} exists`);
    await pool
      .query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`)
      .catch((err) => {
        console.log(`Create error: ${err}`);
      });
  };

  const poolPromise = ensureSchema(pool)
    .then(async () => {
      console.log(`Doing database creation`);
      //connect to db
      const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
          dialect: "mysql",
          host: process.env.DB_HOST,
        }
      );

      //init models and add them to the exported db object
      db.students = require("../routes/student/student.model")(sequelize);
      db.parents = require("../routes/parent/parent.model")(sequelize);
      db.teachers = require("../routes/teacher/teacher.model")(sequelize);

      // sync all models with database
      sequelize.sync();
    })
    .catch((err) => {
      console.log(`Lower errro: ${err}`);
    });

  poolPromise;
}

initialize();
