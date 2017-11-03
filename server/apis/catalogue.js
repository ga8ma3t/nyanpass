import redis from '../models/redis'
import {fetchFriends} from '../models/twitter'

/**
 * friendListを取得
 * @param twitterId
 * @param tokenKey
 * @param tokenSecret
 * @returns {Promise.<Object>}
 */
function fetchFriendList(twitterId, tokenKey, tokenSecret) {
  return Promise.resolve().then(() => {
    return fetchFriendListFromRedis(twitterId)
  }).then(friendList => {
    return friendList || fetchFriendListFromTwitterAPI(twitterId, tokenKey, tokenSecret)
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
 * @param tokenKey
 * @param tokenSecret
 * @returns {Promise.<Object>}
 */
function fetchFriendListFromTwitterAPI(twitterId, tokenKey, tokenSecret) {
  return fetchFriends(twitterId, tokenKey, tokenSecret).then(friendList => {
    cacheFriendListToRedis(twitterId, friendList) // キャッシュ処理の結果は無視
    return friendList
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
  })
}
