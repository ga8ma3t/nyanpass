import Sequelize from 'sequelize';
import database from './database';

const User = database.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: Sequelize.STRING,
  twitterId: Sequelize.STRING,
  twitterName: Sequelize.STRING,
  twitterTokenKey: Sequelize.STRING,
  twitterTokenSecret: Sequelize.STRING
})

User.sync({force: false})

export default User;
