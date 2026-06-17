const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://13.233.146.16:3000",
  })
);

app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.send("My PERN Project is Running!");
});

// Create Todo
app.post("/api/todos", async (req, res) => {
  try {
    const { title } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO todos(title) VALUES($1) RETURNING *",
      [title]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get All Todos
app.get("/api/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todos");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get One Todo
app.get("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await pool.query(
      "SELECT * FROM todos WHERE id = $1",
      [id]
    );

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update Todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    await pool.query(
      "UPDATE todos SET title = $1 WHERE id = $2",
      [title, id]
    );

    res.json("Todo Updated Successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete Todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM todos WHERE id = $1",
      [id]
    );

    res.json("Todo Deleted Successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
pool.connect((err, client, release) => {
  if (err) {
    return console.error(
      "Database connection failed:",
      err.message
    );
  }

  console.log("Database connected successfully");
  release();

  app.listen(5000, "0.0.0.0", () => {
    console.log("Server started on port 5000");
  });
});