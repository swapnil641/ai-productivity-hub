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

  <div className="App">
    <h1>Todo App</h1>

<div className="input-container">
  <input
    type="text"
    placeholder="Add your new todo"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />

  <button onClick={addTodo}>+</button>
</div>

{todos.map((todo) => (
  <div className="todo-item" key={todo.id}>
    <h3>{todo.title}</h3>

    <div className="actions">
      <button
        className="edit-btn"
        onClick={() => updateTodo(todo.id)}
      >
        ✏️
      </button>

      <button
        className="delete-btn"
        onClick={() => deleteTodo(todo.id)}
      >
        🗑️
      </button>
    </div>
  </div>
))}

<div className="footer">
  <span>You have {todos.length} pending tasks</span>
</div>

  </div>
);


}

export default App;
