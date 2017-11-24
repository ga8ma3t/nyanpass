import redis from '../models/redis'
import {fetchFriends} from '../models/twitter'
import {
  fetchUserListWithSpaceByEvent,
  fetchUserListWithSpaceByEventAndFriendList,
  updateUsersByFriendList
} from '../models/catalogue'
import {fetchEventByAlternateId} from '../models/event'

export async function fetchRecommendsCatalogue(req, res, next) {
  const eventId = req.params.eventId
  const event = await fetchEventByAlternateId(eventId)
  res.json(await fetchAnonymousCatalogue(event))
}

async function fetchAnonymousCatalogue(event) {
  const recommend = await fetchUserListWithSpaceByEvent(event)
  return { recommend }
}

export async function fetchFriendsCatalogue(req, res, next) {
  if (!req.user) {
    const err = new Error('Unauthorized')
    err.status = 401
    next(err)
    return
  }
  const event = await fetchEventByAlternateId(req.params.eventId)
  const twitterAuth = [req.user.twitterId, req.user.twitterTokenKey, req.user.twitterTokenSecret]
  res.json(await fetchLoggedInCatalogue(event, twitterAuth))
}

async function fetchLoggedInCatalogue(event, twitterAuth) {
  const friendList = await fetchFriendList(...twitterAuth)
  const userList = await fetchUserListWithSpaceByEventAndFriendList(event, friendList)
  const friends = await updateUsersByFriendList(userList, friendList)
  return { friends }
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
