require('babel-polyfill')
require('babel-register')
require('dotenv').config({ silent: true })

require('./tasks/users')
require('./tasks/events')
