import express from 'express'
import {fetchFriends} from '../model/twitter'

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    user: req.user,
    token: req.csrfToken()
  });
});

router.get('/test', (req, res, next) => {
  if (req.user) {
    fetchFriends(
      req.user.twitterId,
      req.user.twitterTokenKey,
      req.user.twitterTokenSecret
    )
  }
  res.render('index', {
    user: req.user,
    token: req.csrfToken()
  });
});

export default router;
