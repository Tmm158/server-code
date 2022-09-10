const Router = require('koa-router')
const router = new Router()
const jwtVerify = require('../../utils')
const { returnMsg, queryFn } = require('../../utils')
// 时间格式化
const moment = require('moment')

router.get('/list', async (ctx) => {
  let sql = `select id,title,subTitle,date from article`
  let result = await queryFn(sql)
  ctx.body = returnMsg(0, '文章列表获取成功', result)
})

// 编辑文章接口
router.post('/list/edit', async (ctx) => {
  // 鉴权
  let token = ctx.request.headers['cms-token']
  if (!jwtVerify(token)) {
    ctx.body = returnMsg(2, '查询用户信息失败', 'token过期或用户不存在')
    return
  }
  // 鉴权成功
  // 根据token查询数据库的editable字段，判断该用户是否有编辑权限
  let sql2 = `select editable from user where token=${token}`
  let result = await queryFn(sql2)
  if (result[0].editable === 1) {
    // 有编辑权限
    //1. 查看编辑的文章的id
    let { id } = ctx.request.body
    //2. 去数据库看是否有该文章
    let sql1 = `select * from article where id=${id}`
    let result = queryFn(sql1)
    if (result.length > 0) {
      //有该文章，就修改数据库
      let myDate = moment().format('YYYY-MM-DD hh:mm:ss')
      let sql1 = `update article set title="${title}",subTitlt="${subTitle}",content="${content}",date="${myDate}",author="${author}" where id=${id}`
      let result1 = await queryFn(sql1)
      ctx.body = returnMsg(0, '文章修改成功')
    } else {
      // 没有该文章
      ctx.body = returnMsg(1, '当前文章不存在')
      return
    }
  } else {
    //没有编辑权限
    ctx.body = returnMsg(1, '用户没有编辑权限')
    return
  }
})
module.exports = router
