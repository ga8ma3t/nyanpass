'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('events', 'place',
      {type: Sequelize.STRING})
  },

  down: (queryInterface) => {
    queryInterface.removeColumn('events', 'place')
  }
}
