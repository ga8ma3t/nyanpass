'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('events', [{
      id: 'a2894003-50e1-4cbb-898b-db31aee96996',
      alternateId: 'c93',
      name: 'コミックマーケット93',
      type: 'comiket',
      date: '2017-12-29',
      place: '東京ビッグサイト',
      optional: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.bulkDelete('events', {id: 'a2894003-50e1-4cbb-898b-db31aee96996'}, {})
    ])
  }
}
