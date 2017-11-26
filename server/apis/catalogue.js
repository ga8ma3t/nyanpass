import redis from '../models/redis'
import {fetchTwitterFriendIds} from '../models/twitter'
import {
  fetchBookmarkIds, fetchBySpaceIds,
  fetchRecommendUserListWithSpaceByEvent, fetchRecommendUserListWithSpaceByFriends,
  fetchUserListWithSpaceByEventAndFriendIds
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
  const friendIds = await fetchFriendIds(...pickTwitterAuth(user))
  const friends = await fetchUserListWithSpaceByEventAndFriendIds(event, friendIds)
  const recommends = await fetchRecommendUserListWithSpaceByFriends(event, friends)
  const bookmarkIds = await fetchBookmarkIds(user, event)
  const bookmarks = await fetchBySpaceIds(bookmarkIds)
  return {
    bookmarks: formatCircles(event, bookmarks, bookmarkIds),
    recommends: formatCircles(event, recommends, bookmarkIds),
    friends: formatCircles(event, friends, bookmarkIds)
  }
}

function formatCircles(event, circles, bookmarkIds = []) {
  const formattedCircles = circles.map(circle => Object.assign(
    circle,
    { space: Object.assign(
      circle.space,
      { isBookmarked: bookmarkIds.includes(circle.space.id) }
    )}
  ))
  return event.dates.map((_, i) => formattedCircles.filter(circle => circle.space.date === i + 1))
}

/**
 * friendIdsを取得
 * @param twitterId
 * @param twitterTokenKey
 * @param twitterTokenSecret
 * @returns {Promise.<Object>}
 */
function fetchFriendIds(twitterId, twitterTokenKey, twitterTokenSecret) {
  return Promise.resolve().then(() => {
    return fetchFriendIdsFromRedis(twitterId)
  }).then(friendIds => {
    return friendIds || fetchFriendIdsFromTwitterAPI(twitterId, twitterTokenKey, twitterTokenSecret)
  })
}

/**
 * redisからFriendIdsを取得する処理
 * @param twitterId
 * @returns {Promise.<Object>}
 */
function fetchFriendIdsFromRedis(twitterId) {
  return Promise.resolve().then(() => {
    return redis.get(`friendIds::${twitterId}`)
  }).then(friendIds => {
    return JSON.parse(friendIds)
  })
}

/**
 * twitterAPIからFriendIdsを取得する処理
 * @param twitterId
 * @param twitterTokenKey
 * @param twitterTokenSecret
 * @returns {Promise.<Object>}
 */
function fetchFriendIdsFromTwitterAPI(twitterId, twitterTokenKey, twitterTokenSecret) {
  return fetchTwitterFriendIds(twitterId, twitterTokenKey, twitterTokenSecret).then(friendIds => {
    return cacheFriendIdsToRedis(twitterId, friendIds)
  })
}

/**
 * FriendIdsを15分間Redisにキャッシュする処理
 * @param twitterId
 * @param friendIds
 * @returns {Promise.<Object>}
 */
function cacheFriendIdsToRedis(twitterId, friendIds) {
  return Promise.resolve().then(() => {
    return redis.set(`friendIds::${twitterId}`, JSON.stringify(friendIds))
  }).then(() => {
    return redis.expire(`friendIds::${twitterId}`, 60 * 15)
  }).then(() => {
    return friendIds
  })
}
