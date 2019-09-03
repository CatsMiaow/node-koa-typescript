import { RouterContext } from 'koa-router';
import { IVerifyOptions } from 'passport-local';

import { passport } from '../utils/passport';

/**
 * BaseController
 */
export class Base {
  public login = (ctx: RouterContext, next: () => Promise<void>): void => {
    return passport.authenticate('local', (err: Error, user: unknown, info: IVerifyOptions, status: number) => {
      if (err) {
        ctx.status = status || 500;
        ctx.app.emit('error', err, ctx);
        return;
      }

      if (!user) {
        ctx.throw(400, info.message);
        return;
      }

      ctx.body = user;
      ctx.login(user);
    })(ctx, next);
  }
  // Login Check
  public check = (ctx: RouterContext): void => {
    ctx.body = ctx.session.passport.user;
  }

  public logout = (ctx: RouterContext): void => {
    ctx.logout();
    ctx.redirect('/');
  }
}

export const base: Base = new Base();
