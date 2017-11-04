import express from 'express'
import {fetchCatalogue} from '../apis/catalogue'
import {extractC93LayoutReport} from '../utils/extract-c93'

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    user: req.user,
    token: req.csrfToken()
  });
});

router.get('/api/catalogue/:eventId', (req, res) => {
  fetchCatalogue(
    req.params.eventId,
    req.user.twitterId,
    req.user.twitterTokenKey,
    req.user.twitterTokenSecret
  ).then(result => {
    res.json(result)
  })
})

router.get('/api/dangerzone/extract-c93', (req, res) => {
  extractC93LayoutReport(req.query.count, req.query.cursor, req.query.sinceId).then(result => {
    res.json(result)
  }).catch(err => {
    res.json(err)
  })
})

export default router;
