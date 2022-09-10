const Router = require('koa-router')
const router = new Router()
const { returnMsg, query, queryFn } = require('../../utils')

router.post('/', async (ctx) => {
  let { username, password } = ctx.request.body
  if (username && password) {
    //查询数据库中是否有该username及password
    let result = await queryFn(
      `select * from user where username="${username}"`
    )
    if (result.length > 0) {
      // 有这个用户，返回给前端，该用户已注册
      ctx.body = returnMsg(2, '注册失败', '该用户已注册')
    } else {
      // 没有这个用户，开始注册
      // 0表示不允许编辑
      let sql1 = `insert into user values (null,"${username}","${password}",null,"avatar.jpg",'normal',0)`
      await queryFn(sql1)
      ctx.body = returnMsg(0, '注册成功')
    }
  } else {
    ctx.body = returnMsg(1, '请求失败', '参数有误')
  }
})
module.exports = router
