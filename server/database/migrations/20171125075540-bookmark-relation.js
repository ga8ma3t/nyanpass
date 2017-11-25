'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bookmark_relations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      spaceId: {
        type: Sequelize.UUID,
        references: {
          model: 'spaces',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() =>
      queryInterface.addIndex(
        'bookmark_relations',
        ['userId', 'spaceId'],
        { indicesType: 'UNIQUE' }
      )
    )
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('bookmark_relations')
  }
}
