module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      timezone: "+09:00"
    }
  },
  production: {
    username: 'database_dev',
    password: 'database_dev',
    database: 'database_dev',
    host: '127.0.0.1',
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true
      },
      timezone: "+09:00"
    }
  }
}
