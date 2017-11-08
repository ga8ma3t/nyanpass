import {Space, User, Op} from '../database/models/index'

export function fetchUserListWithSpaceByEventAndFriendList(event, friendList) {
  const twitterIds = friendList.map(friend => friend.twitterId)
  return User.findAll({
    attributes: ['id', 'name', 'twitterId', 'twitterName'],
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
  })
}

export function fetchSpaceListWithUserByEventAndFriendList(event, friendList) {
  const twitterIds = friendList.map(friend => friend.twitterId)
  return Space.findAll({
    attributes: ['id', 'name', 'date', 'district', 'block', 'space'],
    include: [{
      model: User,
      attributes: ['id', 'name', 'twitterId', 'twitterName'],
      where: {twitterId: {[Op.in]: twitterIds}},
      through: {attributes: []}
    }],
    where: {
      eventId: event.id
    },
    order: [
      ['date', 'ASC'],
      ['block', 'ASC'],
      ['space', 'ASC']
    ]
  })
}
