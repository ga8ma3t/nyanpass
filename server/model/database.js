import Sequelize from 'sequelize';

const databaseUrl = process.env.DATABASE_URL;
const sequelize = new Sequelize(databaseUrl, {
  // sequelize model options
})

sequelize.sync({force: true})

export default sequelize
