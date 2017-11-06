import Twitter from 'twitter'

export function fetchFriends(twitterId, tokenKey, tokenSecret) {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: tokenKey,
    access_token_secret: tokenSecret
  })
  return new Promise((resolve, reject) => {
    let friendsList = []
    let limitCounter = 0
    function loop(cursor) {
      limitCounter++
      return client.get('friends/list', {
        'user_id': twitterId,
        'skip_status': true,
        'include_user_entities': false,
        count: 200, // 一度に取得できるのは200件
        cursor: cursor
      }).then(result => {
        const list = result.users.map(user => {
          return {
            name: user.name, // 例：なのくろ
            twitterId: user['id_str'],
            twitterName: user['screen_name'], // 例：nanocloudx
            image: user['profile_image_url_https'] // TODO 文字列末尾の _normal.jpg を _200x200.jpg にする
          }
        })
        Array.prototype.push.apply(friendsList, list);
        const nextCursor = result['next_cursor']
        // 終端まで取得した、あるいはAPIを15回叩いた場合は終了
        if (nextCursor === 0 || limitCounter >= 15) {
          resolve(friendsList)
        } else {
          loop(nextCursor)
        }
      }).catch((error) => {
        reject(error)
      });
    }
    loop(-1);
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
      return Promise.resolve({ cursor: null, list: [] })
    } else if (result.statuses.length === 0) {
      return Promise.resolve({ cursor: null, list: [] })
    }

    const list = result.statuses.map(status => {
      return {
        id: status['id_str'],
        text: status.text,
        name: status.user.name, // 例：なのくろ
        twitterId: status.user['id_str'],
        twitterName: status.user['screen_name'], // 例：nanocloudx
      }
    })

    const nextCursor = result.statuses[result.statuses.length - 1]['id_str']
    return Promise.resolve({ cursor: nextCursor, list })
  }).catch((error) => {
    return Promise.reject({ error, cursor, list: [] })
  });
}
