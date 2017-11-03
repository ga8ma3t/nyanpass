'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('events', [{
      id: 'a2894003-50e1-4cbb-898b-db31aee96996',
      name: 'コミックマーケット93',
      type: 'comiket',
      date: '2017-12-31',
      optional: 'null',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('events', {id: 'a2894003-50e1-4cbb-898b-db31aee96996'}, {})
    ])
  }
}
