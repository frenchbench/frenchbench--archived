const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

export function init() {

  passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback/"
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ));

}
