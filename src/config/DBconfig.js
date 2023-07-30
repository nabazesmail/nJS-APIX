// DBconfig.js

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: (query) => {
      console.log('SQL Query:', query);
    },
    alter: process.env.AUTO_MIGRATION,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: (query) => {
      console.log('SQL Query:', query);
    },
    alter: process.env.AUTO_MIGRATION,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: (query) => {
      console.log('SQL Query:', query);
    },
    alter: process.env.AUTO_MIGRATION,
  }
};
