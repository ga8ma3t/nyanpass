import { BookmarkRelation } from '../database/models/index'

export function addBookmarkedSpace(userId, spaceId) {
  return BookmarkRelation.create({userId, spaceId})
}

export function removeBookmarkedSpace(userId, spaceId) {
  return BookmarkRelation.destroy({where: {userId, spaceId}})
}
