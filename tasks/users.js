import gulp from 'gulp'
import { bulkApply } from '../server/models/user'
import { lookupUsers } from '../server/models/twitter'
import { updateUsersByTwitterUserList } from '../server/models/catalogue'

gulp.task('users:update', async() => {
  await bulkApply(async(users) => {
    const twitterUsers = await lookupUsers(users.map(user => user.twitterId))
    updateUsersByTwitterUserList(users, twitterUsers)
  })
  process.exit()
})
