import {User} from '../database/models/index'

/**
 * ユーザーをIdから取得します
 * @param userId
 * @returns {Promise.<Model>}
 */
export function fetchUserById(userId) {
  return User.findById(userId)
}

/**
 * ユーザーをtwitterIdから取得します
 * @param twitterId
 * @returns {Promise.<Model>}
 */
export function fetchUserByTwitterId(twitterId) {
  return User.findOne({where: { twitterId: twitterId }})
}

/**
 * ユーザーを作成します
 *
 * @param twitterId
 * @param name
 * @param twitterName
 * @param imageUrl
 * @param twitterTokenKey
 * @param twitterTokenSecret
 */
export function createUser(twitterId, name, twitterName, imageUrl, twitterTokenKey = null, twitterTokenSecret = null) {
  return User.create({twitterId, name, twitterName, imageUrl, twitterTokenKey, twitterTokenSecret})
}

/**
 * ユーザーをtwitterIdから取得、無ければ作成します
 *
 * @param user
 * @returns {Promise.<Object>}
 */
export function findOrCreateUserByTwitterId(user) {
  return Promise.resolve().then(() => {
    return fetchUserByTwitterId(user.twitterId)
  }).then(result => {
    return result || User.create(user)
  })
}

/**
 * ユーザーを更新します
 *
 * @param twitterId
 * @param name
 * @param twitterName
 * @param imageUrl
 * @param twitterTokenKey
 * @param twitterTokenSecret
 */
export function updateUser(twitterId, name, twitterName, imageUrl, twitterTokenKey = null, twitterTokenSecret = null) {
  return User.update({name, twitterName, imageUrl, twitterTokenKey, twitterTokenSecret}, {where: {twitterId}}).then(() => {
    return fetchUserByTwitterId(twitterId)
  })
}

/**
 * Passport向けユーザー取得処理
 *
 * @param twitterId
 * @param name
 * @param twitterName
 * @param imageUrl
 * @param twitterTokenKey
 * @param twitterTokenSecret
 * @returns {Promise.<Object>}
 */
export function fetchUserForPassport(twitterId, name, twitterName, imageUrl, twitterTokenKey, twitterTokenSecret) {
  // 既にユーザーが存在しているか確認
  return fetchUserByTwitterId(twitterId).then(user => {
    // 存在しない場合は新規作成して返す
    if (!user) {
      return createUser(twitterId, name, twitterName, imageUrl, twitterTokenKey, twitterTokenSecret)
    }
    // 存在するが差分がある場合は更新して返す
    if (
      user.twitterTokenKey !== twitterTokenKey ||
      user.twitterTokenSecret !== twitterTokenSecret ||
      user.name !== name ||
      user.twitterName !== twitterName ||
      user.imageUrl !== imageUrl
    ) {
      return updateUser(twitterId, name, twitterName, imageUrl, twitterTokenKey, twitterTokenSecret)
    }
    // 存在して差分がない場合はそのまま返す
    return user
  })
}

export async function bulkApply(f, loopMax = 300, limit = 100) {
  let offset = 0
  for (let i = 0; i < loopMax; i++) {
    let users = await User.findAll({ limit, offset })
    if (users.length === 0) {
      break
    }
    await f(users)
    offset += users.length
  }
  console.log('end')
}
