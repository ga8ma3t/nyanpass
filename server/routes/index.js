import express from 'express'
import {fetchEventList, fetchEvent} from '../apis/event'
import {fetchCatalogue} from '../apis/catalogue'
import { addBookmark, removeBookmark } from '../apis/bookmark'

const router = express.Router()

router.get('/api/events', fetchEventList)
router.get('/api/events/:eventId', fetchEvent)
router.get('/api/catalogues/:eventId', fetchCatalogue)
router.get(['/', '/catalogues/:eventId', '/about'], (req, res) => {
  res.render('index', {
    user: req.user,
    token: req.csrfToken()
  })
})
router.post('/api/bookmarks/:spaceId', addBookmark)
router.delete('/api/bookmarks/:spaceId', removeBookmark)

export default router
