const config = require('./config');
const documentdb = require('documentdb');
const passport = require('passport');
const WindowsLiveStrategy = require('passport-windowslive');

// initialize Azure DocumentDB
const db = new documentdb.DocumentClient(config.dbUrl, { masterKey: config.dbKey });

const verifyWindowsLiveStrategy = (accessToken, refreshToken, profile, cb) => {
  return cb(null, profile);
};

const windowsLiveStrategyConfig = {
  clientID: process.env.MICROSOFT_ID,
  clientSecret: process.env.MICROSOFT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth`,
};

const deserializeUser = (userId, cb) => {
  cb(null, userId);
};

const serializeUser = (user, cb) => {
  cb(null, user.id);
};

passport.use(new WindowsLiveStrategy(
  windowsLiveStrategyConfig,
  verifyWindowsLiveStrategy
));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

const authenticate = (req, res, next) => {

  const isAuthenticated = passportSession => {
    return passportSession
      && passportSession.user
      && passportSession.user === config.userId;
  };

  if (isAuthenticated(req.session.passport)) {

    return next();

  }

  const authReq = {
    originalUrl: req.originalUrl,
    ttl: 10,
    type: 'authRequest',
  };

  db.createDocument(config.collLink, authReq, (err, doc) => {

    if (err) {
      console.error(err, err.stack);
      return next(new Error('Unable to store authentication request.'));
    }

    const opts = {
      scope: ['wl.signin', 'wl.offline_access', 'wl.basic'],
      state: doc.id,
    };

    passport.authenticate('windowslive', opts)(req, res, next);

  });

};

const oauthCallback = (req, res, next) => {

  const getAuthReq = () => new Promise((resolve, reject) => {
    const docLink = `${config.collLink}/docs/${req.query.state}`;

    db.readDocument(docLink, (err, doc) => {
      if (err) {
        console.error(err);
        reject(new Error('Could not look up authentication request.'));
      }
      resolve(doc.originalUrl);
    });
  });

  passport.authenticate('windowslive', (err, user, info) => {

    if (err) return next(err);

    if (user) {

      getAuthReq()
      .then(originalUrl => {
        req.login(user, err => {
          if (err) return next(err);

          req.session.save(err => {
            console.log(process.env);
            if (err) return next(err);
            res.render('home');
            // res.redirect(originalUrl);
          });

        });
      })
      .catch(err => next(err));

    } else {
      res.redirect('/');
    }

  })(req, res, next);

};

module.exports = {
  authenticate,
  oauthCallback,
  passport,
};
