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
  const id = (() => {
    let params = url.split('/').filter(param => param !== '');
    return params.length > 1 ? params[1] : null;
  })();

  switch (method) {
    case 'GET': // 取得 todo
      let todos = todo.getTodo(id);
      endRespond({
        "status": "success",
        "data": todos
      })
      break;

    case 'POST': // 新增 todo
      todo.createTodo(req);
      endRespond({
        "status": "success",
        "message": "to do is created!"
      })
      break;

    case 'PATCH': // 修改 todo
      if (id) {
        todo.updateTodo(id, req);
        endRespond({
          "status": "success",
          "message": "todo was updated!"
        })
      } else {
        endRespond({
          "status": "fail",
          "message": "id is required!"
        }, 400)
      }
      break;

    case 'DELETE': // 刪除 todo
      todo.deleteTodo(id);
      endRespond({
        "status": "success",
        "message": "todo was deleted"
      })
      break;

    default:
      console.log('do nothing');
      break;
  }

  function endRespond(result, statusCode = 200) {
    res.writeHead(statusCode, headers);
    res.write(JSON.stringify(result));
    res.end();
  }
};


const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);