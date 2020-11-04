const config = require("dbConfig.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {
  students: this.students,
  teachers: this.teachers,
  parents: this.parents,
};

async function initialize() {
  const pool = await mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    waitForConnections: true,
  });

  const ensureSchema = async (pool) => {
    console.log(`Ensured that table ${process.env.MYSQL_DATABASE} exists`);
    await pool.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE};`
    );
  };

  const poolPromise = ensureSchema(pool)
    .then(async () => {
      console.log(`Doing database creation`);
      //connect to db
      const sequelize = new Sequelize(
        process.env.MYSQL_DATABASE,
        process.env.MYSQL_USER,
        process.env.MYSQL_PASSWORD,
        {
          dialect: "mysql",
          host: process.env.MYSQL_HOST,
          port: process.env.MYSQL_PORT,
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
      console.log(`Ensure Schema Error: ${err}`);
    });

  poolPromise;
}

initialize().catch((err) => {
  console.log(`Initilization Error: ${err}`);
});
