import Sequelize from 'sequelize';

export const Op = Sequelize.Op

export const database = new Sequelize(process.env.DATABASE_URL, {
  // sequelize models options
})

export const User = database.define('user', {
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

export const Space = database.define('space', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: Sequelize.STRING,
  date: Sequelize.INTEGER,
  district: Sequelize.STRING,
  block: Sequelize.STRING,
  space: Sequelize.STRING
})

export const Event = database.define('event', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  alternateId: Sequelize.STRING,
  type: Sequelize.STRING,
  name: Sequelize.STRING,
  date: Sequelize.DATEONLY,
  optional: Sequelize.JSON
})

export const SpaceMemberRelation = database.define('space_member_relation', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  }
})

// Space has one Event
Space.belongsTo(Event)

// SpaceMemberRelation
Space.belongsToMany(User, {through: 'space_member_relation'})
User.belongsToMany(Space, {through: 'space_member_relation'})

database.sync()
