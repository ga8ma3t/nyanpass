'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('events', 'alternateId',
      {type: Sequelize.STRING, unique: true})
  },

  down: (queryInterface) => {
    queryInterface.removeColumn('events', 'alternateId')
  }
}
