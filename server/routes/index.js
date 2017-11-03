import express from 'express'
import {fetchCatalogue} from '../apis/catalogue'

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    user: req.user,
    token: req.csrfToken()
  });
});

router.get('/api/catalogue/:eventId', (req, res) => {
  // すべきこと
  // 1-1: Redisからフレンド一覧を取得する(無ければtwitterAPIを叩いてRedisに格納する)
  // 1-2: eventIdの情報を取得する
  // 1-3: eventのtypeに紐づく抽出ロジックにフレンド一覧を渡して結果を受け取る
  // 2-1: 結果を元にSpaceTを生成する(重複注意)
  // 2-2: 生成されたspaceIdの生成元となったアカウントのuserIdを生成
  // 2-3: 生成されたspaceIdと、生成されたuserIdを、SpaceOwnerRelationに入れる
  // 2-4: 生成されたspaceIdと、自分のuserIdを、CatalogueRelationに入れる
  // 3-1: CatalogueRelationから、自分のuserIdが含まれたカラムだけを抽出する
  // 3-2: 抽出された一覧から、spaceIdに紐づくeventIdが指定されたイベントと一致したものだけを抽出する
  // 3-3: 結果をJSONで返す

  fetchCatalogue(
    req.params.eventId,
    req.user.twitterId,
    req.user.twitterTokenKey,
    req.user.twitterTokenSecret
  ).then(result => {
    res.json(result)
  })
})

router.put('/api/bookmark/:spaceId', (req, res) => {
  // こっちは簡単だろうし後回し
})

// router.get('/api/fetch-circle-friends', (req, res) => {
//
//   // MEMO
//   // fetchFriendsはtwitterのlimit上限により一度に最大で3000件までしか取得できない
//   // 15分経過後に再試行するみたいな実装にすれば可能だが複雑度が増すので対応しない
//
//   if (req.user) {
//
//     // TODO 先にRedisにキャッシュがあるか探索する(15分で揮発させる)
//     // extractCache::{userId} みないな key に探索結果を全部入れる
//     // 15分で揮発させて、redisにあればtwitterAPIを叩かない
//     redis.get('')
//
//     fetchFriends(
//       req.user.twitterId,
//       req.user.twitterTokenKey,
//       req.user.twitterTokenSecret
//     ).then((friends) => {
//       const filterCircle = new FilterCircle('c93', ['金','土','日'])
//       const result = friends.map(friend => {
//         const circle = filterCircle.exec(friend.name)
//         return circle ? Object.assign({ account: friend }, {circle}) : null
//       }).filter(friend => !!friend)
//       res.json(result)
//     }).catch(err => {
//
//       // TODO
//       // twitterのlimit制限(15分15回)に到達すると以下のerrorがくる
//       // [{"message":"Rate limit exceeded","code":88}]
//       // そもそも叩かないように15分間はredisあたりにキャッシュするように実装する
//       // 取得したサークルリストの保存更新する処理はここではない別のところで実装する
//
//       console.warn(err)
//       res.json(err)
//     })
//   } else {
//     res.redirect('/auth/twitter')
//   }
// });

export default router;
