import React, { useState, useEffect } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../api/todoApi";
import "../App.css";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    id: null, // Added ID for editing
    title: "",
    description: "",
    due_date: "",
    completed: 0,
  });
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await getTodos();
    setTodos(response.data);
  };

  const handleCreateTodo = async () => {
    await createTodo(newTodo);
    setNewTodo({ title: "", description: "", due_date: "" }); // Reset form
    fetchTodos();
  };

  const handleUpdateTodo = async (id, completed) => {
    const newCompletedValue = completed === 1 ? 0 : 1;
    await updateTodo(id, { completed: newCompletedValue });
    fetchTodos();
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    fetchTodos();
  };

  const handleEditTodo = (todo) => {
    setNewTodo({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      due_date: todo.due_date,
      completed: todo.completed,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    await updateTodo(newTodo.id, newTodo); // Send updated todo data
    setIsEditing(false); // Exit editing mode
    setNewTodo({ title: "", description: "", due_date: "" }); // Reset form
    fetchTodos();
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Exit editing mode
    setNewTodo({ title: "", description: "", due_date: "" }); // Reset form
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <div className="todo-form">
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
        />
        <input
          type="date"
          value={newTodo.due_date}
          onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
        />
        <div className="todo-buttons">
          <button
            onClick={isEditing ? handleSaveEdit : handleCreateTodo}
            className="action-button"
          >
            {isEditing ? "Save Edit" : "Add Todo"}
          </button>
          <button
            onClick={handleCancelEdit}
            className="action-button cancel-button"
            disabled={!isEditing}
          >
            Cancel
          </button>
        </div>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div className="todo-header">
              <h3>{todo.title}</h3>
              <label>
                <input
                  type="radio"
                  name={`todo-${todo.id}`}
                  checked={todo.completed === 1}
                  onChange={() => handleUpdateTodo(todo.id, todo.completed)}
                />
                Mark as Complete
              </label>
            </div>
            <p>{todo.description}</p>
            {/* Format the due_date for display */}
            <p>Due Date: {formatDate(todo.due_date)}</p>
            <p>Status: {todo.completed ? "Completed" : "Pending"}</p>

            <div className="todo-actions">
              {/* Edit button */}
              <button
                onClick={() => handleEditTodo(todo)}
                className="action-button"
              >
                Edit
              </button>
              {/* Delete button */}
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="action-button delete-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
