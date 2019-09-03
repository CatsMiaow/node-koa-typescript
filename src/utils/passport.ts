import passport from 'koa-passport';
import { RouterContext } from 'koa-router';
import { Strategy as LocalStrategy } from 'passport-local';

passport.serializeUser((user: unknown, done: Function) => {
  done(null, user);
});

passport.deserializeUser((user: unknown, done: Function) => {
  try {
    // more
    // const user = await fetchUser();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new LocalStrategy(async (username: string, password: string, done: Function): Promise<void> => {
  try {
    if (username !== 'test') {
      throw new Error('NotFoundUserData');
    }
    // const user = await getUser(username, password);
    const user: { id: string } = { id: 'test' };

    // Auth Success
    done(null, user);
  } catch (err) {
    if (err.code) {
      // Auth Fail
      done(null, false, { message: err.code });
    } else {
      // Auth Error
      done(err);
    }
  }
}));

function authenticated(ctx: RouterContext, next: Function): void {
  if (ctx.isAuthenticated()) {
    return next();
  }

  ctx.throw(401);
}

export {
  passport,
  authenticated
};
