import {Space, User, Op} from '../database/models/index'

/**
 * スペースを作るお（ ＾ω＾）
 * @param space spaceObj
 * @returns {Promise.<Object>}
 */
export function findOrCreateSpace(space) {
  return Promise.resolve().then(() => {
    return fetchSpaceByUniqueSpacePosition(space)
  }).then(result => {
    return result || createSpace(space)
  })
}

export function fetchSpaceByUniqueSpacePosition(space) {
  return Space.findOne({
    where: {
      eventId: space.eventId,
      date: space.date,
      block: space.block,
      space: space.space
    }
  })
}

export function createSpace(space) {
  return Space.create(space)
}

export function addSpaceMember(space, user) {
  return space.hasUser(user).then((result) => {
    if (!result) {
      return space.addUser(user)
    } else {
      return Promise.resolve()
    }
  })
}

export function fetchSpaceListByEventAndFriendList(event, friendList) {
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
