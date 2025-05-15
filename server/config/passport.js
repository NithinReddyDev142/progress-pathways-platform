
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

// JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// Configure JWT strategy
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Find the user based on the token payload
      const user = await User.findById(payload.id);

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      done(error, false);
    }
  })
);

// Configure Google OAuth strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await User.findOne({ googleId: profile.id });

          // If not, create a new user
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              username: profile.displayName.replace(/\s+/g, '_').toLowerCase() || `user_${Date.now()}`,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
              password: '', // No password for Google auth users
            });
          }

          // Update last login
          user.lastLogin = new Date();
          await user.save();

          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
}

// Serialize and deserialize user for sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
