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

function bodyparser(req, callback) {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      callback(JSON.parse(body));
    } catch(err) {
      console.log(err);
    }
  })
}

module.exports = {
  getTodo(uuid) {
    if (uuid === null) {
      return todos;
    } else {
      return todos.find(todo => todo.uuid === uuid)
    }
  },
  createTodo(req) {
    return bodyparser(req, (data) => {
      let newTodo = data;
      newTodo.uuid = uuidv4();
      todos.push(newTodo);
    })
  },
  updateTodo(uuid, req) {
    return bodyparser(req, (data) => {
      const { title } = data;
      let todo = todos.find(todo => todo.uuid === uuid);

      if(!todo) return false;

      todo.title = title;
      return true;

    })
  },
  deleteTodo(uuid) {
    if(uuid === null) {
      todos = [];
    } else {      
      const index = todos.findIndex(todo => todo.uuid === uuid);
      todos.splice(index, 1);
    }
  },
}