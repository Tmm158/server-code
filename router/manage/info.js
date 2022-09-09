//用户信息接口（查询，修改）
const Router = require('koa-router')
const router = new Router()

const { returnMsg, query, queryFn, jwtVerify } = require('../../utils')

// 查询用户信息
router.get('/', async (ctx) => {
  // 获取前端请求过来的token
  let token = ctx.request.headers.token
  // 鉴权
  if (!jwtVerify(token)) {
    ctx.body = returnMsg(2, '查询用户信息失败', 'token过期或没有该用户')
    return
  }
  //鉴权成功
  let sql = `select username,token,avatar from user where token="${token}"`
  let result = await queryFn(sql)
  ctx.body = result[0]
})

module.exports = router
