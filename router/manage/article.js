const Router = require('koa-router')
const router = new Router()
const { returnMsg, queryFn } = require('../../utils')

router.get('/list', async ctx => {
  let sql = `select id,title,subTitle,date from article`
  let result = await queryFn(sql)
  ctx.body = returnMsg(0, '文章列表获取成功', result)
})
module.exports = router
