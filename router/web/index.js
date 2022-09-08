const Router = require('koa-router')
const router = new Router()
router.get('/', async (ctx) => {
  ctx.body = '前端页面'
})
module.exports = router
