'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('events', 'alternateId',
      {type: Sequelize.STRING, unique: true});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('events', 'alternateId');
  }
};
