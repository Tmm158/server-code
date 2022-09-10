const Router = require('koa-router')
const router = new Router()
const login = require('./login.js')
const register = require('./register.js')
const info = require('./info')
const upload = require('./upload')
const article = require('./article')
//manage
router.get('/', async (ctx) => {
  ctx.body = '管理系统'
})
router.use('/login', login.routes(), login.allowedMethods())
router.use('/register', register.routes(), register.allowedMethods())
router.use('/info', info.routes(), info.allowedMethods())
router.use('/upload', upload.routes(), upload.allowedMethods())
router.use('/article', article.routes(), article.allowedMethods())

module.exports = router
