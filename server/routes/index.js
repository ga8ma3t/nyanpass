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
  // すべきこと
  // 1-1: Redisからフレンド一覧を取得する(無ければtwitterAPIを叩いてRedisに格納する)
    // 1-2: eventIdの情報を取得する
    // 1-3: eventのtypeに紐づく抽出ロジックにフレンド一覧を渡して結果を受け取る
    // 2-1: 結果を元にSpaceTを生成する(重複注意)
    // 2-2: 生成されたspaceIdの生成元となったアカウントのuserIdを生成
    // 2-3: 生成されたspaceIdと、生成されたuserIdを、SpaceOwnerRelationに入れる
  // 3-1: Spaceから、フレンド一覧に含まれるuserIdが含まれたカラムだけを抽出する
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

router.get('/api/dangerzone/extract-c93', (req, res) => {
  extractC93LayoutReport(req.query.count, req.query.cursor, req.query.sinceId).then(result => {
    res.json(result)
  }).catch(err => {
    res.json(err)
  })
})

export default router;
