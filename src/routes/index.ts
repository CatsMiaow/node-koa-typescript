import Router, { RouterContext } from 'koa-router';

import { base } from '../controllers';
import { authenticated } from '../utils/passport';

const router: Router = new Router()

router.get('/health', (ctx: RouterContext) => {
  ctx.body = { message: 'OK' };
});

// Test Router
router.get('/login', base.login); // change get to post
router.get('/check', authenticated, base.check);
router.get('/logout', base.logout);

// tslint:disable-next-line: export-name
export { router as indexRouter };
