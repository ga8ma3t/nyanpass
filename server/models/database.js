import Sequelize from 'sequelize';

export const database = new Sequelize(process.env.DATABASE_URL, {
  // sequelize models options
})

export const User = database.define('User', {
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

export const Space = database.define('Space', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  date: Sequelize.INTEGER,
  block: Sequelize.STRING,
  space: Sequelize.STRING
})

export const Event = database.define('Event', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  type: Sequelize.STRING,
  name: Sequelize.STRING,
  date: Sequelize.DATEONLY,
  optional: Sequelize.JSON
})

export const UserSpaceRelation = database.define('UserSpaceRelation', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  }
})

export const CatalogueRelation = database.define('CatalogueRelation', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  isBookmarked: Sequelize.BOOLEAN
})

// Space has one Event
Space.belongsTo(Event)

// UserSpaceRelation
Space.belongsToMany(User, {through: 'UserSpaceRelation'})
User.belongsToMany(Space, {through: 'UserSpaceRelation'})

// CatalogueRelation
Space.belongsToMany(User, {through: 'CatalogueRelation'})
User.belongsToMany(Space, {through: 'CatalogueRelation'})

database.sync({force: true})
