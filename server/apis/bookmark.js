import { addBookmarkedSpace, removeBookmarkedSpace } from '../models/bookmark'

export function addBookmark(req, res, next) {
  const user = req.user
  if (!user) {
    const err = new Error('Unauthorized')
    err.status = 401
    next(err)
    return
  }

  addBookmarkedSpace(user.id, req.params.spaceId)
    .then(() => { res.json({ status: 200 }) })
    .catch(() => { res.status(404).json({ status: 404 }) })
}

export function removeBookmark(req, res, next) {
  const user = req.user
  if (!user) {
    const err = new Error('Unauthorized')
    err.status = 401
    next(err)
    return
  }

  removeBookmarkedSpace(user.id, req.params.spaceId)
    .then(() => { res.json({ status: 200 }) })
    .catch(() => { res.status(404).json({ status: 404 }) })
}
