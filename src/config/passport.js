import passportJWT from 'passport-jwt';
import db from '../models';

const { ExtractJwt } = passportJWT;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.SECRET_KEY;

const passportAuth = (passport) => {
  const getUser = async (email) => db.User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      email
    }
  });

  const strategy = new JwtStrategy(jwtOptions, async (jwtPayload, next) => {
    const user = await getUser(jwtPayload.email);
    const tokenDate = new Date(jwtPayload.logoutTime);
    const type = jwtPayload.type;
    const userDate = new Date(user.logoutTime);

    // Check if token is valid by comparing logoutTime time from the user and in the token
    if (user && tokenDate.toUTCString() === userDate.toUTCString()) {
      next(null, user, { type });
    } else {
      next(null, false, { message: 'token invalid' });
    }
  });
  passport.use(strategy);
};

export default passportAuth;