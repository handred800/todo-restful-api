const { v4: uuidv4 } = require('uuid');

let todos = [
  {
    "title": "good",
    "uuid": uuidv4()
  },
  {
    "title": "nice",
    "uuid": uuidv4()
  },
];

module.exports = {
  getTodo(uuid) {
    if (uuid === null) {
      // 返回全部
      return {
        "status": "success",
        "data": todos
      }
    } else {
      const index = todos.findIndex(todo => todo.uuid === uuid);
      if (index !== -1) {
        return {
          "status": "success",
          "data": todos[index]
        }
      } else {
        return {
          "status": "fail",
          "message": "查無 ID"
        }
      }

    }
  },
  createTodo(req) {
    return new Promise((resovle, reject) => {

      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          let newTodo = JSON.parse(body);

          if (newTodo.title) {
            newTodo.uuid = uuidv4();
            todos.push(newTodo);
            resovle({
              "status": "success",
              "data": todos
            });
          } else {
            reject({
              "status": "fail",
              "message": "沒填寫 title"
            });
          }
        }
        catch {
          reject({
            "status": "fail",
            "message": "todo 格式錯誤"
          });
        }
      })

    })
  },
  updateTodo(uuid, req) {
    return new Promise((resovle, reject) => {
      let index = todos.findIndex(todo => todo.uuid === uuid);
      if (index !== -1) {
        let body = '';

        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const { title } = JSON.parse(body);
            if (title) {
              todos[index].title = title;
              resovle({
                "status": "success",
                "message": "todo is updated!"
              })
            } else {
              reject({
                "status": "fail",
                "message": "沒填寫 title"
              })
            }
          }
          catch {
            reject({
              "status": "fail",
              "message": "todo 格式錯誤"
            });
          }
        })

      } else {
        reject({
          "status": "fail",
          "message": "查無 ID"
        })
      }
    });
  },
  deleteTodo(uuid) {
    if (uuid === null) {
      todos = [];
      return {
        "status": "success",
        "message": "all todo is deleted!"
      }
    } else {
      const index = todos.findIndex(todo => todo.uuid === uuid);
      if(index !== -1) {
        todos.splice(index, 1);
        return {
          "status": "success",
          "message": "todo is deleted!"
        }
      } else {
        return {
          "status": "fail",
          "message": "查無 ID"
        }
      }
    }
  },
}