import express from 'express'
import {fetchEventList, fetchEvent} from '../apis/event'
import {fetchCatalogue} from '../apis/catalogue'

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

export default router
