import omit from 'lodash.omit'
import {Space, User, Op, sequelize} from '../database/models/index'

export function fetchRecommendUserListWithSpaceByEvent(event) {
  return User.findAll({
    attributes: ['id', 'name', 'imageUrl', 'twitterId', 'twitterName'],
    include: [{
      model: Space,
      attributes: ['id', 'name', 'date', 'district', 'block', 'space'],
      where: {eventId: event.id, block: 'あ'},
      through: {attributes: []},
      duplicating: false
    }],
    limit: 15,
    order: [
      sequelize.fn('RANDOM')
    ]
  }).then(formatUsers)
}

export function fetchRecommendUserListWithSpaceByFriends(event, friends) {
  const blocks = friends.map(friend => {
    const space = friend.space
    return { date: space.date, block: space.block }
  })
  return User.findAll({
    attributes: ['id', 'name', 'imageUrl', 'twitterId', 'twitterName'],
    include: [{
      model: Space,
      attributes: ['id', 'name', 'date', 'district', 'block', 'space'],
      where: {
        id: {
          [Op.notIn]: friends.map(friend => friend.space.id)
        },
        eventId: event.id,
        [Op.or]: Array.from(new Set(blocks))
      },
      through: {attributes: []},
      duplicating: false
    }],
    limit: 15,
    order: [
      sequelize.fn('RANDOM')
    ]
  }).then(formatUsers)
}

export function fetchUserListWithSpaceByEventAndFriendIds(event, friendIds) {
  return User.findAll({
    attributes: ['id', 'name', 'imageUrl', 'twitterId', 'twitterName'],
    include: [{
      model: Space,
      attributes: ['id', 'name', 'date', 'district', 'block', 'space'],
      where: {eventId: event.id},
      through: {attributes: []}
    }],
    where: {
      twitterId: {[Op.in]: friendIds}
    },
    order: [
      [Space, 'date', 'ASC'],
      [Space, 'block', 'ASC'],
      [Space, 'space', 'ASC']
    ]
  }).then(formatUsers)
}

export async function fetchBookmarkIds(user, event) {
  return Space.findAll({
    attributes: ['id'],
    include: [{
      model: User,
      as: 'bookmarked',
      attributes: [],
      through: { attributes: [] },
      where: { id: user.id }
    }],
    where: { eventId: event.id }
  }).then(spaces => spaces.map(space => space.id))
}

export async function fetchBySpaceIds(ids) {
  return User.findAll({
    attributes: ['id', 'name', 'imageUrl', 'twitterId', 'twitterName'],
    include: [{
      model: Space,
      attributes: ['id', 'name', 'date', 'district', 'block', 'space'],
      where: {
        id: {
          [Op.in]: ids
        }
      },
      through: {attributes: []}
    }]
  }).then(formatUsers)
}

function formatUsers(users) {
  return users.map(user => omit(
    Object.assign(
      user.get({plain: true}),
      { space: user.spaces[0].get({plain: true}) }
    ), 'spaces')
  )
}

export function updateUsersByTwitterUserList(users, friendList) {
  const twitterIdMap = friendList.reduce((map, friend) => {
    map[friend.twitterId] = friend
    return map
  }, {})
  return Promise.all(users.map((user) => {
    const friend = twitterIdMap[user.twitterId]
    if (friend &&
      (user.name !== friend.name ||
        user.twitterName !== friend.twitterName ||
        user.imageUrl !== friend.imageUrl)) {
      user.name = friend.name
      user.twitterName = friend.twitterName
      user.imageUrl = friend.imageUrl
      return user.save().then(() => user)
    } else {
      return user
    }
  }))
}

export function createUsersByTwitterUserList(friendList) {
  return User.bulkCreate(friendList)
}
