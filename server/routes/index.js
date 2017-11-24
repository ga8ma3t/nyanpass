import express from 'express'
import {fetchEventList, fetchEvent} from '../apis/event'
import {fetchCatalogue} from '../apis/catalogue'
import {extractC93LayoutReport} from '../apis/dangerzone'

const router = express.Router()

router.get('/api/events', fetchEventList)
router.get('/api/events/:eventId', fetchEvent)
router.get('/api/catalogues/:eventId', fetchCatalogue)
router.get('/api/dangerzone/extract-c93', extractC93LayoutReport)// TODO デプロイ時には消す!!!
router.get(['/', '/catalogues/:eventId', '/about'], (req, res) => {
  res.render('index', {
    user: req.user,
    token: req.csrfToken()
  })
})

export default router
