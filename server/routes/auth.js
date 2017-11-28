import express from 'express'
import passport from 'passport'
import passportTwitter from 'passport-twitter'
import {fetchUserForPassport} from '../models/user'
import {convertTwitterImageUrl} from '../utils/util'

const TwitterStrategy = passportTwitter.Strategy
const router = express.Router()

router.get('/status', (req, res) => {
  res.json({
    session: req.user && req.user.id ? {
      id: req.user.id,
      twitterId: req.user.twitterId,
      name: req.user.name,
      twitterName: req.user.twitterName,
      imageUrl: req.user.imageUrl,
      token: req.csrfToken()
    } : null
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.user = null
  res.redirect('/')
})

router.get('/twitter', (req, res, next) => {
  const from = req.query.from ? req.query.from : ''
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL + '?from=' + from
  },
  (twitterTokenKey, twitterTokenSecret, profile, callback) => {
    return fetchUserForPassport(
      profile.id,
      profile.displayName,
      profile.username,
      convertTwitterImageUrl(profile._json['profile_image_url_https']),
      twitterTokenKey,
      twitterTokenSecret
    ).then((user) => {
      return callback(null, user)
    }).catch((err) => {
      return callback(err)
    })
  }))

  passport.authenticate('twitter', {
    successRedirect: from || '/',
    failureRedirect: '/'
  })(req, res, next)
})

export default router
