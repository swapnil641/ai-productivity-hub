import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    const response = await axios.get("http://3.110.189.247:5000/api/todos");
    setTodos(response.data);
  };

  const addTodo = async () => {
    await axios.post("http://3.110.189.247:5000/api/todos", {
      title: title
    });

    setTitle("");
    getTodos();
  };

const deleteTodo = async (id) => {
  await axios.delete(
    `http://3.110.189.247:5000/api/todos/${id}`
  );

  getTodos();
};

const updateTodo = async (id) => {

  const newTitle = prompt("Enter new todo title");

  if (!newTitle) return;

  await axios.put(
    `http://3.110.189.247:5000/api/todos/${id}`,
    {
      title: newTitle
    }
  );

  getTodos();
};

return (

  <div className="app">
    <div className="container">
      <div className="header">
        <h1>🚀 DevOps Todo Dashboard</h1>
        <p>React • Node.js • PostgreSQL • Docker • Jenkins</p>
      </div>

```
  <div className="input-box">
    <input
      type="text"
      placeholder="Add a new task..."
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />

    <button onClick={addTodo}>Add Task</button>
  </div>

  <div className="stats">
    <div className="card">
      <h2>{todos.length}</h2>
      <span>Total Tasks</span>
    </div>
  </div>

  <div className="todo-list">
    {todos.map((todo) => (
      <div className="todo-card" key={todo.id}>
        <div>
          <h3>{todo.title}</h3>
          <small>Task #{todo.id}</small>
        </div>

        <div className="actions">
          <button
            className="edit"
            onClick={() => updateTodo(todo.id)}
          >
            ✏️
          </button>

          <button
            className="delete"
            onClick={() => deleteTodo(todo.id)}
          >
            🗑️
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
```

  </div>
);

  
}

export default App;
