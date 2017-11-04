import {Space} from '../database/models/index'

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
