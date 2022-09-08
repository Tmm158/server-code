const mysql = require('mysql')
let host = 'http://127.0.0.1'
let port = 9000

const pool = mysql.createPool({
  host: 'localhost', // 连接的服务器(代码托管到线上后，需改为内网IP，而非外网)
  port: 3306, // mysql服务运行的端口
  database: 'cms', // 选择某个数据库
  user: 'root', // 用户名
  password: '123456' // 用户密码
})

// 对数据库进行增删改查操作的基础
const query = (sql, callback) => {
  pool.getConnection(function (err, connection) {
    connection.query(sql, function (err, rows) {
      callback(err, rows)
      connection.release()
    })
  })
}

//封装返回信息的结构:0为成功；1为错误
// {
//   errCode:0,
//   message:'注册成功',
//   data:{}

// }
const returnMsg = (errCode, message, data) => {
  return {
    errCode: errCode || 0,
    message: message || '',
    data: data || {}
  }
}

// 数据库操作封装
const queryFn = (sql) => {
  return new Promise((resolve, reject) => {
    query(sql, (err, rows) => {
      if (err) reject(err)
      resolve(rows)
    })
  })
}

module.exports = {
  host,
  port,
  query,
  returnMsg,
  queryFn
}
