import redis from '../models/redis'
import {fetchFriends} from '../models/twitter'
import {
  fetchBookmarkIds, fetchBySpaceIds,
  fetchRecommendUserListWithSpaceByEvent, fetchRecommendUserListWithSpaceByFriends,
  fetchUserListWithSpaceByEventAndFriendList
} from '../models/catalogue'
import {fetchEventByAlternateId} from '../models/event'

export async function fetchCatalogue(req, res) {
  const event = await fetchEventByAlternateId(req.params.eventId)
  const result = req.user
    ? await fetchLoggedInCatalogue(event, req.user)
    : await fetchAnonymousCatalogue(event)
  res.json(result)
}

function pickTwitterAuth(user) {
  return [user.twitterId, user.twitterTokenKey, user.twitterTokenSecret]
}

async function fetchAnonymousCatalogue(event) {
  const recommends = await fetchRecommendUserListWithSpaceByEvent(event)
  return {
    recommends: formatCircles(event, recommends)
  }
}

async function fetchLoggedInCatalogue(event, user) {
  const friendList = await fetchFriendList(...pickTwitterAuth(user))
  const friends = await fetchUserListWithSpaceByEventAndFriendList(event, friendList)
  const recommends = await fetchRecommendUserListWithSpaceByFriends(event, friends)
  const bookmarkIds = await fetchBookmarkIds(user, event)
  const bookmarks = await fetchBySpaceIds(bookmarkIds)
  return {
    bookmarks: formatCircles(event, bookmarks),
    recommends: formatCircles(event, recommends),
    friends: formatCircles(event, friends)
  }
}

function formatCircles(event, circles) {
  return event.dates.map((_, i) => circles.filter(circle => circle.space.date === i + 1))
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
