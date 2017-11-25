import Sequelize from 'sequelize'

export const Op = Sequelize.Op

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  // sequelize models options
})

export const User = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: Sequelize.STRING,
  imageUrl: Sequelize.STRING,
  twitterId: Sequelize.STRING,
  twitterName: Sequelize.STRING,
  twitterTokenKey: Sequelize.STRING,
  twitterTokenSecret: Sequelize.STRING
})

export const Space = sequelize.define('space', {
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

export const Event = sequelize.define('event', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  alternateId: Sequelize.STRING,
  type: Sequelize.STRING,
  name: Sequelize.STRING,
  date: Sequelize.DATEONLY,
  place: Sequelize.STRING,
  optional: Sequelize.JSON
})

export const SpaceMemberRelation = sequelize.define('space_member_relation', {
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

sequelize.sync()
