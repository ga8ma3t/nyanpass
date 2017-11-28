import redis from '../models/redis'
import { fetchTwitterFriendIds, lookupUsers } from '../models/twitter'
import {
  createUsersByTwitterUserList,
  fetchBookmarkIds, fetchBySpaceIds,
  fetchRecommendUserListWithSpaceByEvent, fetchRecommendUserListWithSpaceByFriends,
  fetchUserListWithSpaceByEventAndFriendIds
} from '../models/catalogue'
import {fetchEventByAlternateId} from '../models/event'
import { fetchUnregisteredTwitterIds } from '../models/user'

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
  const rawRecommends = await Promise.all(
    event.dates.map((_, i) => fetchRecommendUserListWithSpaceByEvent(event, i + 1))
  )
  const recommends = formatCircles(event, rawRecommends.reduce((a, b) => a.concat(b)))
  return { recommends }
}

async function fetchLoggedInCatalogue(event, user) {
  const twitterAuth = pickTwitterAuth(user)
  const friendIds = await fetchFriendIds(...twitterAuth)
  await createUnregisteredUsers(friendIds, twitterAuth)
  const bookmarkIds = await fetchBookmarkIds(user, event)
  const rawFriends = await fetchUserListWithSpaceByEventAndFriendIds(event, friendIds)
  const friends = formatCircles(event, rawFriends, bookmarkIds)
  const rawRecommends = await Promise.all(friends.map((circles, i) =>
    circles.length > 0
      ? fetchRecommendUserListWithSpaceByFriends(event, circles)
      : fetchRecommendUserListWithSpaceByEvent(event, i + 1)
  ))
  const recommends = formatCircles(event, rawRecommends.reduce((a, b) => a.concat(b)), bookmarkIds)
  const rawBookmarks = await fetchBySpaceIds(bookmarkIds)
  const bookmarks = formatCircles(event, rawBookmarks, bookmarkIds)
  return { bookmarks, recommends, friends }
}

async function createUnregisteredUsers(ids, twitterAuth) {
  try {
    const unregisteredIds = await fetchUnregisteredTwitterIds(ids)
    const size = 100
    for (let i = 0; i < unregisteredIds.length; i += size) {
      const twitterUsers = await lookupUsers(unregisteredIds.slice(i, i + size), ...twitterAuth)
      createUsersByTwitterUserList(twitterUsers)
    }
  } catch (err) {
    // 途中で失敗した場合は成功したところまでで諦める
    // (次回アクセス時に続きから登録処理を行う
    console.log(err)
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
