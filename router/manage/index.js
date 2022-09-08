const Router = require('koa-router')
const router = new Router()
const login = require('./login.js')
const register = require('./register.js')
//manage
router.get('/', async (ctx) => {
  ctx.body = '管理系统'
})
router.use('/login', login.routes(), login.allowedMethods())
router.use('/register', register.routes(), register.allowedMethods())

module.exports = router
