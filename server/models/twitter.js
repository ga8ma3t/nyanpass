import Twitter from 'twitter'
import {convertTwitterImageUrl} from '../utils/util'

export function fetchTwitterFriendIds(twitterId, tokenKey, tokenSecret) {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: tokenKey,
    access_token_secret: tokenSecret
  })
  return new Promise((resolve, reject) => {
    let friendIdsList = []
    let limitCounter = 0
    function loop(cursor) {
      limitCounter++
      return client.get('friends/ids', {
        'user_id': twitterId,
        'stringify_ids': true,
        'include_user_entities': false,
        count: 5000, // 一度に取得できるのは5000件
        cursor: cursor
      }).then(result => {
        Array.prototype.push.apply(friendIdsList, result.ids)
        const nextCursor = result['next_cursor']
        // 終端まで取得した、あるいはAPIを15回叩いた場合は終了
        if (nextCursor === 0 || limitCounter >= 15) {
          resolve(friendIdsList)
        } else {
          loop(nextCursor)
        }
      }).catch((error) => {
        reject(error)
      })
    }
    loop(-1)
  })
}

export function searchTweets(cursor = null, sinceId = null) {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
  })
  const param = Object.assign(
    {
      'q': '◎貴サークル ブロック -rt -shindanmaker',
      'lang': 'ja',
      'result_type': 'recent',
      'count': 100,
      'include_entities': false
    },
    cursor ? { 'max_id': cursor } : {},
    sinceId ? { 'since_id': sinceId } : {}
  )
  return client.get('search/tweets', param).then(result => {
    // 終端処理
    if (result.statuses.length === 1 && cursor === result.statuses[0]['id_str']) {
      return { cursor: null, list: [] }
    } else if (result.statuses.length === 0) {
      return { cursor: null, list: [] }
    }
    const list = result.statuses.map(status => {
      return {
        id: status['id_str'],
        text: status.text,
        name: status.user.name, // 例：なのくろ
        imageUrl: convertTwitterImageUrl(status.user['profile_image_url_https']),
        twitterId: status.user['id_str'],
        twitterName: status.user['screen_name'] // 例：nanocloudx
      }
    })
    const nextCursor = result.statuses[result.statuses.length - 1]['id_str']
    return {cursor: nextCursor, list}
  }).catch(error => {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({error, cursor, list: []})
  })
}

export async function lookupUsers(ids) {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
  })
  const result = await client.get('users/lookup', {user_id: ids.join(',')})
  return result.map(user => ({
    name: user.name, // 例：なのくろ
    twitterId: user['id_str'],
    twitterName: user['screen_name'], // 例：nanocloudx
    imageUrl: convertTwitterImageUrl(user['profile_image_url_https'])
  }))
}
