import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    const response = await axios.get("http://localhost:5000/api/todos");
    setTodos(response.data);
  };

  const addTodo = async () => {
    await axios.post("http://localhost:5000/api/todos", {
      title: title
    });

    setTitle("");
    getTodos();
  };

const deleteTodo = async (id) => {
  await axios.delete(
    `http://localhost:5000/api/todos/${id}`
  );

  getTodos();
};

const updateTodo = async (id) => {

  const newTitle = prompt("Enter new todo title");

  if (!newTitle) return;

  await axios.put(
    `http://localhost:5000/api/todos/${id}`,
    {
      title: newTitle
    }
  );

  getTodos();
};

  return (
    <div>
      <h1>My Todo App</h1>

      <input
        type="text"
        placeholder="Enter Todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={addTodo}>Add Todo</button>

      <hr />
	{todos.map((todo) => (
  <div key={todo.id}>
    <h3>{todo.title}</h3>

	<button onClick={() => updateTodo(todo.id)}>
  Edit
</button>

    <button onClick={() => deleteTodo(todo.id)}>
      Delete
    </button>
  </div>
))}

    </div>
  );
}

export default App;
