import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import koaCompress from 'koa-compress';
// import koaCsrf from 'koa-csrf';
import koaHelmet from 'koa-helmet';
import koaLogger from 'koa-logger';
import Router, { RouterContext } from 'koa-router';
import koaSession from 'koa-session';
import koaStatic from 'koa-static';

import { indexRouter } from './routes';
import { logger } from './utils';
import { passport } from './utils/passport';

// https://github.com/koajs/koa/wiki
const app: Koa = new Koa();
app.keys = ['dAPI'];
app.use(koaCompress());
app.use(koaBodyParser());
app.use(koaSession(app));
app.use(passport.initialize());
app.use(passport.session());
app.use(koaStatic(`${__dirname}/../public`));
app.use(koaHelmet());
// app.use(new koaCsrf());

if (process.env.NODE_ENV === 'production') {
  app.use(async (ctx: RouterContext, next: Function) => {
    let user: string = '-';
    if (ctx.session.passport && ctx.session.passport.user) {
      user = ctx.session.passport.user.id;
    }

    logger.info(new Date().toLocaleString(), `${ctx.method} ${ctx.originalUrl} ${ctx.request.ip.replace('::ffff:', '')} ${user}`);
    await next();
  });
} else {
  app.use(koaLogger());
}

const router: Router = indexRouter;
app.use(async (ctx: RouterContext, next: Function) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { message: err.message };
    ctx.app.emit('error', err, ctx);
  }
});
app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err: Error, ctx: RouterContext) => {
  logger.error('Error', err, ctx);
});

app.listen(3000, () => {
  logger.info('Running 3000');
});
