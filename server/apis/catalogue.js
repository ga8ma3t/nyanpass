import redis from '../models/redis'
import {fetchFriends} from '../models/twitter'
import {fetchSpaceListByEventAndFriendList} from "../models/space";
import {fetchEventByAlternateId} from "../models/event";

/**
 * ログインユーザーのフレンド一覧から指定したイベントに参加するサークルを取得します
 *
 * @param eventId
 * @param twitterId
 * @param twitterTokenKey
 * @param twitterTokenSecret
 * @returns {Promise.<Object>}
 */
export function fetchCatalogue(eventId, twitterId, twitterTokenKey, twitterTokenSecret) {
  // TODO すべきこと
  // 1-1: Redisからフレンド一覧を取得する(無ければtwitterAPIを叩いてRedisに格納する)
  // 1-2: eventIdの情報を取得する
  // 1-3: eventのtypeに紐づく抽出ロジックにフレンド一覧を渡して結果を受け取る
  // 2-1: 結果を元にSpaceTを生成する(重複注意)
  // 2-2: 生成されたspaceIdの生成元となったアカウントのuserIdを生成
  // 2-3: 生成されたspaceIdと、生成されたuserIdを、SpaceOwnerRelationに入れる
  // 3-1: Spaceから、フレンド一覧に含まれるuserIdが含まれたカラムだけを抽出する
  // 3-2: 抽出された一覧から、spaceIdに紐づくeventIdが指定されたイベントと一致したものだけを抽出する
  // 3-3: 結果をJSONで返す

  return Promise.resolve().then(() => {
    return Promise.all([
      fetchFriendList(twitterId, twitterTokenKey, twitterTokenSecret),
      fetchEventByAlternateId(eventId)
    ])
  }).then(([friendList, event]) => {
    return fetchSpaceListByEventAndFriendList(event, friendList)
  })
}

/**
 * friendListを取得
 * @param twitterId
 * @param twitterTokenKey
 * @param twitterTokenSecret
 * @returns {Promise.<Object>}
 */
function fetchFriendList(twitterId, twitterTokenKey, twitterTokenSecret) {
  return Promise.resolve().then(() => {
    return fetchFriendListFromRedis(twitterId)
  }).then(friendList => {
    return friendList || fetchFriendListFromTwitterAPI(twitterId, twitterTokenKey, twitterTokenSecret)
  })
}

/**
 * redisからfriendListを取得する処理
 * @param twitterId
 * @returns {Promise.<Object>}
 */
function fetchFriendListFromRedis(twitterId) {
  return Promise.resolve().then(() => {
    return redis.get(`friendList::${twitterId}`)
  }).then(friendList => {
    return JSON.parse(friendList)
  })
}

/**
 * twitterAPIからfriendListを取得する処理
 * @param twitterId
 * @param twitterTokenKey
 * @param twitterTokenSecret
 * @returns {Promise.<Object>}
 */
function fetchFriendListFromTwitterAPI(twitterId, twitterTokenKey, twitterTokenSecret) {
  return fetchFriends(twitterId, twitterTokenKey, twitterTokenSecret).then(friendList => {
    return cacheFriendListToRedis(twitterId, friendList)
  })
}

/**
 * friendListを15分間Redisにキャッシュする処理
 * @param twitterId
 * @param friendList
 * @returns {Promise.<Object>}
 */
function cacheFriendListToRedis(twitterId, friendList) {
  return Promise.resolve().then(() => {
    return redis.set(`friendList::${twitterId}`, JSON.stringify(friendList))
  }).then(() => {
    return redis.expire(`friendList::${twitterId}`, 60 * 15)
  }).then(() => {
    return friendList
  })
}
