const Router = require('koa-router')
const router = new Router()
router.get('/', async (ctx) => {
  ctx.body = '404,接口找不到'
})
module.exports = router
