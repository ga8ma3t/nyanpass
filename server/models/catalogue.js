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
  }).then(users => users.map(user => omit(Object.assign(user.get({plain: true}), {space: user.spaces[0]}), 'spaces')))
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
  }).then(users => users.map(user => omit(Object.assign(user.get({plain: true}), {space: user.spaces[0]}), 'spaces')))
}

export function fetchUserListWithSpaceByEventAndFriendList(event, friendList) {
  const twitterIds = friendList.map(friend => friend.twitterId)
  return User.findAll({
    attributes: ['id', 'name', 'imageUrl', 'twitterId', 'twitterName'],
    include: [{
      model: Space,
      attributes: ['id', 'name', 'date', 'district', 'block', 'space'],
      where: {eventId: event.id},
      through: {attributes: []}
    }],
    where: {
      twitterId: {[Op.in]: twitterIds}
    },
    order: [
      [Space, 'date', 'ASC'],
      [Space, 'block', 'ASC'],
      [Space, 'space', 'ASC']
    ]
  }).then(users => users.map(user => omit(Object.assign(user.get({plain: true}), {space: user.spaces[0]}), 'spaces')))
}

export function updateUsersByFriendList(users, friendList) {
  const twitterIdMap = friendList.reduce((map, friend) => {
    map[friend.twitterId] = friend
    return map
  }, {})
  return Promise.all(users.map((user) => {
    const friend = twitterIdMap[user.twitterId]
    if (friend &&
      (user.name !== friend.name ||
        user.twitterName !== friend.twitterName ||
        user.imageUrl !== friend.image)) {
      user.name = friend.name
      user.twitterName = friend.twitterName
      user.imageUrl = friend.image
      return user.save().then(() => user)
    } else {
      return user
    }
  }))
}
