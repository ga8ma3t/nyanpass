import {User} from '../database/models/index'

/**
 * ユーザーを取得します
 * @param twitterId
 * @returns {Promise.<Model>}
 */
export function fetchUserByTwitterId(twitterId) {
  return User.findOne({where:{ twitterId: twitterId }})
}

/**
 * ユーザーを作成します
 *
 * @param twitterId
 * @param name
 * @param twitterName
 * @param twitterTokenKey
 * @param twitterTokenSecret
 */
export function createUser(twitterId, name, twitterName, twitterTokenKey = null, twitterTokenSecret = null) {
  return User.create({twitterId, name, twitterName, twitterTokenKey, twitterTokenSecret})
}

/**
 * ユーザーを更新します
 *
 * @param twitterId
 * @param name
 * @param twitterName
 * @param twitterTokenKey
 * @param twitterTokenSecret
 */
export function updateUser(twitterId, name, twitterName, twitterTokenKey = null, twitterTokenSecret = null) {
  return User.update({name, twitterName, twitterTokenKey, twitterTokenSecret}, {where: {twitterId}}).then(() => {
    return fetchUserByTwitterId(twitterId)
  })
}

/**
 * Passport向けユーザー取得処理
 *
 * @param twitterId
 * @param name
 * @param twitterName
 * @param twitterTokenKey
 * @param twitterTokenSecret
 * @returns {Promise.<Object>}
 */
export function fetchUserForPassport(twitterId, name, twitterName, twitterTokenKey, twitterTokenSecret) {
  // 既にユーザーが存在しているか確認
  return fetchUserByTwitterId(twitterId).then(user => {
    // 存在しない場合は新規作成して返す
    if (!user) {
      return createUser(twitterId, name, twitterName, twitterTokenKey, twitterTokenSecret)
    }
    // 存在するが差分がある場合は更新して返す
    if (
      user.twitterTokenKey !== twitterTokenKey ||
      user.twitterTokenSecret !== twitterTokenSecret ||
      user.name !== name ||
      user.twitterName !== twitterName
    ) {
      return updateUser(twitterId, name, twitterName, twitterTokenKey, twitterTokenSecret)
    }
    // 存在して差分がない場合はそのまま返す
    return user
  })
}
