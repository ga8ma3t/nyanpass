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
            twitterId: user.id,
            twitterName: user['screen_name'], // 例：nanocloudx
            image: user['profile_image_url_https'] // TODO 文字列末尾の _normal.jpg を _200x200.jpg にする
          }
        })
        Array.prototype.push.apply(friendsList, list);
        const nextCursor = result['next_cursor']
        // 終端まで取得した、あるいはAPIを10回叩いた場合は終了
        if (nextCursor === 0 || limitCounter >= 10) {
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
