const config = require('./config');
const documentdb = require('documentdb');
const passport = require('passport');

// initialize Azure DocumentDB
const dbKey = process.env.DOCUMENTDB_KEY;
const dbUrl = process.env.DOCUMENTDB_URL;
const db = new documentdb.DocumentClient(dbUrl, { masterKey: dbKey });

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

const deserializeUser = (userId, cb) => {
  cb(null, userId);
};

const oauthCallback = (req, res, next) => {

  const getAuthReq = () => new Promise((resolve, reject) => {
    const docLink = `${config.collLink}/docs/${req.query.state}`;

    db.readDocument(docLink, (err, doc) => {
      if (err) {
        console.error(err, err.stack);
        reject(new Error('Could not look up authentication request.'));
      }
      resolve(doc.originalUrl);
    });
  });

  passport.authenticate('windowslive', (err, user, info) => {

    if (err) return next(err);
    if (!user) return res.redirect('/');

    getAuthReq()
    .then(originalUrl => {
      req.login(user, err => {
        if (err) return next(err);
        return res.redirect(originalUrl);
      });
    })
    .catch(err => next(err));

  })(req, res, next);
};

const serializeUser = (user, cb) => {
  cb(null, user.id);
};

const verifyWindowsLiveStrategy = (accessToken, refreshToken, profile, cb) => {
  return cb(null, profile);
};

module.exports = {
  authenticate,
  deserializeUser,
  oauthCallback,
  serializeUser,
  verifyWindowsLiveStrategy,
};
