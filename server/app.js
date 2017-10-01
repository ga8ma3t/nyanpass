import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import {} from 'dotenv/config'
import helmet from 'helmet'
import compression from 'compression'
import session from 'express-session'
import Redis from 'ioredis'
import connectRedis from 'connect-redis'
import csrf from 'csurf'
import passport from 'passport'
import passportTwitter from 'passport-twitter'

import index from './routes/index'
import User from './model/User'

const TwitterStrategy = passportTwitter.Strategy
const RedisStore = connectRedis(session)
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.enable('trust proxy');
app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//--------------------------------------------------
// Session
//--------------------------------------------------
const sessionRedisClient = new Redis(process.env.SESSION_REDIS_URL);
app.use(session({
  secret: 'kurokuroworksSecret',
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({
    client: sessionRedisClient,
    prefix: 'session:',
    ttl: 60 * 60 * 24 * 3 // 3日間アクセスがない場合は Redis からセッション削除
  })
}));

//--------------------------------------------------
// Twitter OAuth
//--------------------------------------------------
app.use(csrf({ cookie: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL
  },
  (tokenKey, tokenSecret, profile, callback) => {
    return Promise.resolve().then(() => {
      return User.findOne({where:{ twitterId: profile.id }})
    }).then((user) => {
      if (!user) {
        return User.create({
          twitterId: profile.id,
          twitterTokenKey: tokenKey,
          twitterTokenSecret: tokenSecret,
          displayName: profile.displayName
        })
      }
      if (user.twitterTokenKey !== tokenKey || user.displayName !== profile.displayName) {
        return User.update({
          twitterTokenKey: tokenKey,
          twitterTokenSecret: tokenSecret,
          displayName: profile.displayName
        }, {
          where: { twitterId: profile.id }
        }).then(() => {
          return User.findOne({where:{ twitterId: profile.id }})
        })
      }
      return user
    }).then((user) => {
      return callback(null, user)
    }).catch((err) => {
      return callback(err)
    })
  }
));
passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    twitterId: user.twitterId,
    twitterTokenKey: user.twitterTokenKey,
    twitterTokenSecret: user.twitterTokenSecret,
    displayName: user.displayName
  });
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

//--------------------------------------------------
// Routing
//--------------------------------------------------
app.use('/', index);

// Authentication
app.get(
  '/auth/twitter',
  passport.authenticate('twitter', {
    successRedirect: '/?auth=success',
    failureRedirect: '/?auth=failure'
  })
);
app.get('/auth/logout', (req, res) => {
  req.logout();
  req.user = null;
  res.redirect('/?auth=logout');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
