const Router = require('koa-router')
const router = new Router()
const path = require('path')
const jwt = require('jsonwebtoken')
const { returnMsg, query, queryFn, jwtVerify } = require('../../utils')
const multer = require('@koa/multer') //加载@koa/multer模块

// 存储文件的名称
let myfilename = ''
// 把文件报存在哪
var storage = multer.diskStorage({
  //文件保存路径:保存在当前文件夹目录下的upload文件夹下
  destination: path.join(__dirname, 'upload/'),
  //修改文件名称
  filename: function (req, file, cb) {
    let type = file.originalname.split('.')[1]
    // logo.png -> logo.xxx.png：文件的名称：logo+时间戳+格式
    myFileName = `${file.fieldname}-${Date.now().toString(
      16
    )}.${file.originalname.split('.').splice(-1)}`
    cb(null, myFileName)
  }
})

//文件上传限制
const limits = {
  fields: 1, //只接受一个字段
  fileSize: 200 * 1024, //文件大小 单位 b
  files: 1 //文件数量
}

const upload = multer({ storage, limits })

// 修改头像
router.post('/', upload.single('avatar'), async (ctx) => {
  // 鉴权
  let token = ctx.request.headers['cms-token']
  let { username, password } = ctx.request.body
  if (!jwtVerify(token)) {
    ctx.body = returnMsg(2, '查询用户信息失败', 'token过期或没有该用户')
    return
  }
  // 鉴权成功，修改token对应的avatar字段
  let sql = `update user set avatar="${myFileName}" where token="${token}"`
  await queryFn(sql)
  // 重新查找当前用户，返回给前端
  let sql1 = `select username,token,avatar from user where token="${token}"`
  let result = await queryFn(sql)
  ctx.body = returnMsg(0, '成功', {
    avatar: result[0].avatar,
    username: result[0].username,
    'cms-token': result[0].token
  })
})

module.exports = router
