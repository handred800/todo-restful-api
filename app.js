const http = require('http');
const todo = require('./todo');

const requestListener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  const method = req.method;
  const url = req.url;
  const params = url.split('/').slice(1); // 第一個 "/" 不算

  const category = params[0] || null;
  const id = params[1] !== null ? params[1] : null;

  if (category === 'todo') {
    switch (method) {
      case 'POST': {// 新增 todo
        todo.createTodo(req)
          .then((res) => {
            endRespond(res);
          })
          .catch((err) => {
            endRespond(err, 400);
          });
        break;
      }
      case 'PATCH': {// 修改 todo
        if (id) {
          todo.updateTodo(id, req)
            .then((res) => {
              endRespond(res);
            })
            .catch((err) => {
              endRespond(err, 400);
            });
        } else {
          endRespond({
            "status": "fail",
            "message": "未指定 todo id"
          }, 400)
        }
        break;
      }
      default:
        endRespond({
          "status": "fail",
          "message": "bad request"
        }, 400)
        break;
    }
  } else if (category === 'todos') {
    switch (method) {
      case 'GET': {// 取得 todo
        const res = todo.getTodo(id);
        endRespond(res);
        break;
      }
      case 'DELETE': { // 刪除 todo
        const res = todo.deleteTodo(id);
        endRespond(res);
        break;
      }
      default:
        endRespond({
          "status": "fail",
          "message": "bad request"
        }, 400)
        break;
    }
  } else {
    endRespond({
      "status": "fail",
      "message": "page not found"
    }, 404)
  }


  function endRespond(result, statusCode = 200) {
    res.writeHead(statusCode, headers);
    res.write(JSON.stringify(result));
    res.end();
  }
};


const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);