import express from 'express'
import {fetchFriends} from '../models/twitter'
import {FilterCircle} from '../models/FilterCircle'
import redis from '../models/redis'

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    user: req.user,
    token: req.csrfToken()
  });
});

router.get('/api/fetch-circle-friends', (req, res, next) => {

  // MEMO
  // fetchFriendsはtwitterのlimit上限により一度に最大で3000件までしか取得できない
  // 15分経過後に再試行するみたいな実装にすれば可能だが複雑度が増すので対応しない

  if (req.user) {

    // TODO 先にRedisにキャッシュがあるか探索する(15分で揮発させる)
    // extractCache::{userId} みないな key に探索結果を全部入れる
    // 15分で揮発させて、redisにあればtwitterAPIを叩かない
    redis.get('')

    fetchFriends(
      req.user.twitterId,
      req.user.twitterTokenKey,
      req.user.twitterTokenSecret
    ).then((friends) => {
      const filterCircle = new FilterCircle('c93', ['金','土','日'])
      const result = friends.map(friend => {
        const circle = filterCircle.exec(friend.name)
        return circle ? Object.assign({ account: friend }, {circle}) : null
      }).filter(friend => !!friend)
      res.json(result)
    }).catch(err => {

      // TODO
      // twitterのlimit制限(15分15回)に到達すると以下のerrorがくる
      // [{"message":"Rate limit exceeded","code":88}]
      // そもそも叩かないように15分間はredisあたりにキャッシュするように実装する
      // 取得したサークルリストの保存更新する処理はここではない別のところで実装する

      console.warn(err)
      res.json(err)
    })
  } else {
    res.redirect('/auth/twitter')
  }
});

export default router;
