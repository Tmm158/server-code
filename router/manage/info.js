//用户信息接口（查询，修改）
const Router = require('koa-router')
const router = new Router()

const { returnMsg, query, queryFn, jwtVerify } = require('../../utils')

// 查询用户信息-----get
router.get('/', async ctx => {
  // 获取前端请求过来的token
  let token = ctx.request.headers['cms-token']
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

// 修改用户信息-----post
router.post('/', async ctx => {
  let token = ctx.request.headers['cms-token']
  let { username, password } = ctx.request.body
  if (!jwtVerify(token)) {
    ctx.body = returnMsg(2, '查询用户信息失败', 'token过期或没有该用户')
    return
  }
  // 当传进来username时，判断数据库中是否有该username
  let sql3 = `select * from user where username="${username}"`
  let result3 = await queryFn(sql3)
  if (result3.length > 0) {
    // 当前数据库存在这个用户名
    ctx.body = returnMsg(1, '用户名已存在')
    return
  }
  // 鉴权成功,修改数据库中的token及username等信息
  // 当用户未输入username和password时，我们先去数据库查询token对应的旧的username和password

  let sql2 = `select username,password from user where token="${token}"`
  let result2 = await queryFn(sql2)
  let sql = `update user set username="${username || result2[0].username}",password="${password || result2[0].password}" where token="${token}"`
  // 更新数据库
  await queryFn(sql)
  // 重新查询当前用户的数据，返回给前端
  let sql1 = `select username,token,avatar from user where token="${token}"`
  let result = await queryFn(sql1)
  ctx.body = returnMsg(0, '修改成功', {
    avatar: result[0].avatar,
    username: result[0].username,
    'cms-token': result[0].token
  })
})

module.exports = router
