'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('events', 'dates', Sequelize.STRING)
      .then(() => queryInterface.removeColumn('events', 'date'))
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('events', 'dates')
      .then(() => queryInterface.addColumn('events', 'date', Sequelize.DATEONLY))
  }
}
