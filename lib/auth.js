const config = require('./config');
const documentdb = require('documentdb');
const passport = require('passport');
const WindowsLiveStrategy = require('passport-windowslive');

// initialize Azure DocumentDB
const db = new documentdb.DocumentClient(config.dbUrl, { masterKey: config.dbKey });

/**
 * This function is for looking up the user who possesses the given profile returned by Passport. Since I know the user in advance (me), it doesn't need to be looked up, and the entire user profile is returned.
 * @method verifyWindowsLiveStrategy
 * @param  {String} accessToken     The access token from the authentication request
 * @param  {String} refreshToken    The refresh token from the authentication request
 * @param  {Object} profile         The user profile returned from authentication
 * @param  {Function} cb            The callback function
 * @return {Function} cb
 */
const verifyWindowsLiveStrategy = (accessToken, refreshToken, profile, cb) => {
  return cb(null, profile);
};

// configuration options for the Windows Live strategy
const windowsLiveStrategyConfig = {
  clientID: process.env.MICROSOFT_ID,
  clientSecret: process.env.MICROSOFT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth`,
};

/**
 * Looks up the user from the database, given the user ID. This is not necessary in this case, since I know in advance who the user is (me), and what the ID is supposed to be.
 * @method deserializeUser
 * @param  {userId} userId        The ID of the user
 * @param  {Function} cb          The callback function
 */
const deserializeUser = (userId, cb) => {
  cb(null, userId);
};

/**
 * Takes a user profile and returns only the information to be stored in the session.
 * In this case, only the user ID is stored in the session.
 * @method serializeUser
 * @param  {Object} user      The user object
 * @param  {Function} cb      The callback function
 */
const serializeUser = (user, cb) => {
  cb(null, user.id);
};

// configure Passport
passport.use(new WindowsLiveStrategy(
  windowsLiveStrategyConfig,
  verifyWindowsLiveStrategy
));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

/**
 * Authenticate middleware for passing to individual routes.
 * Authenticates the user before calling the next handler in the route.
 * @method authenticate
 * @param  {Object} req      The HTTP request object
 * @param  {Object} res      The HTTP response object
 * @param  {Function} next   Call the next handler in the route
 * @return {Function} next   Calls next(), or redirects to the third-party login provider
 */
const authenticate = (req, res, next) => {

  const isAuthenticated = passportSession => {
    return passportSession
      && passportSession.user
      && passportSession.user === config.userId;
  };

  // If the user is already authenticated (present in req.session), call the next handler in the route
  if (isAuthenticated(req.session.passport)) {

    return next();

  }

  // otherwise, authenticate the user

  // create an auth request object (for storing the user's original request URL)
  const authReq = {
    originalUrl: req.originalUrl,
    ttl: 300,
    type: 'authRequest',
  };

  // store the auth request object
  db.createDocument(config.collLink, authReq, (err, doc) => {

    if (err) {
      console.error(err, err.stack);
      return next(new Error('Unable to store authentication request.'));
    }

    const opts = {
      scope: ['wl.signin', 'wl.offline_access', 'wl.basic'],
      state: doc.id,
    };

    // authenticate with Passport, redirecting user to third-party login
    passport.authenticate('windowslive', opts)(req, res, next);

  });

};

/**
 * Handles callbacks from third-party authentication providers
 * @method oauthCallback
 * @param  {Object} req       The HTTP request object
 * @param  {Object} res       The HTTP response object
 * @param  {Function} next    Call the next handler in the route
 */
const oauthCallback = (req, res, next) => {

  // looks up the user's originally-requested URL from the database
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

  // finish authenticating the user with Passport (retrieves the access token)
  passport.authenticate('windowslive', (err, user, info) => {

    if (err) return next(err);

    if (user) {

      getAuthReq() // lookup the user's originally-requested URL
      .then(originalUrl => {
        req.login(user, err => { // log the user in (set req.user)
          if (err) return next(err);

          console.log(req.session.id);

          req.session.save(err => { // save the session to DocumentDB
            if (err) return next(err);
            res.redirect(originalUrl); // redirect to the originally-requested URL
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
