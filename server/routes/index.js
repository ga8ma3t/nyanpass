import express from 'express'
import {fetchEventList} from '../apis/event'
import {fetchCatalogue} from '../apis/catalogue'
import {extractC93LayoutReport} from '../apis/dangerzone'

const router = express.Router()

router.get('/api/events', fetchEventList)
router.get('/api/catalogue/:eventId', fetchCatalogue)
router.get('/api/dangerzone/extract-c93', extractC93LayoutReport)// TODO デプロイ時には消す!!!
router.get(['/', '/catalogue/:eventId'], (req, res) => {
  res.render('index', {
    user: req.user,
    token: req.csrfToken()
  })
})

export default router
