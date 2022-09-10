const Router = require('koa-router')
const router = new Router()
const jwt = require('jsonwebtoken')
const { returnMsg, query, queryFn } = require('../../utils')

router.post('/', async (ctx) => {
  let { username, password } = ctx.request.body

  if (username && password) {
    let sql = `select * from user where username="${username}"`
    let result = await queryFn(sql)
    if (result.length > 0) {
      // 存在该用户
      // 生成token
      let token = jwt.sign(
        { username, password }, // 携带信息
        'zhaowenxian', // 秘钥
        { expiresIn: '1h' } // 有效期：1h一小时
      )
      let sql1 = `update user set token="${token}" where username="${username}"`
      // 在数据库插入token
      await queryFn(sql1)
      // 查询用户
      let result1 = await queryFn(sql)
      let obj = {
        username: result1[0].username,
        'cms-token': result1[0].token,
        avatar: result1[0].avatar,
        player: result1[0].player,
        editable: result1[0].editable
      }
      ctx.body = returnMsg(0, '登陆成功', obj)
    } else {
      // 不存在该用户
      ctx.body = returnMsg(2, '用户不存在', '请注册')
    }
  } else {
    ctx.body = returnMsg(1, '请求失败', '用户名或密码出错')
  }

  // 存入数据库，把生成的token传递给前端

  // ctx.body = token
})
module.exports = router
