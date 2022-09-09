const Koa = require('koa2')
const app = new Koa()
const { port, host } = require('./utils')
const Router = require('koa-router')
const router = new Router()
const manageRouter = require('./router/manage')
const webRouter = require('./router/web')
const nomatch = require('./router/nomatch')
const { route } = require('./router/manage')
const bodyParser = require('koa-bodyparser')

const cors = require('koa2-cors')

const static = require('koa-static')
const path = require('path')

router.get('/', async ctx => {
  ctx.body = '首页数据'
})
router.use('/manage', manageRouter.routes(), manageRouter.allowedMethods())
router.use('/web', webRouter.routes(), webRouter.allowedMethods())
router.use('/404', nomatch.routes(), nomatch.allowedMethods())
router.redirect('/', '/manage')

app.use(async (ctx, next) => {
  await next()
  if (parseInt(ctx.status) === 404) {
    ctx.response.redirect('/404')
  }
})
// 允许跨域
app.use(cors())
app.use(bodyParser())
app.use(router.routes(), router.allowedMethods())
// 读取静态资源
app.use(static(path.join(__dirname, 'static')))

app.listen(port, () => {
  console.log(`${host}:${port}`)
})
