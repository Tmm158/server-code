const Router = require('koa-router')
const router = new Router()
const login = require('./login.js')
const register = require('./register.js')
const info = require('./info')
//manage
router.get('/', async (ctx) => {
  ctx.body = '管理系统'
})
router.use('/login', login.routes(), login.allowedMethods())
router.use('/register', register.routes(), register.allowedMethods())
router.use('/info', info.routes(), info.allowedMethods())

module.exports = router
