import React, { useState, useEffect } from 'react';
import Loading from './components/Loading';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        setTodos(data);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (id, isChecked) => {
    setTodos(prevState =>
      prevState.map(todo => (todo.id === id ? { ...todo, completed: isChecked } : todo))
    );
  };

  const handleInputChange = event => {
    setNewTodo(event.target.value);
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const newTodoItem = {
      userId: 1,
      id: Math.random().toString(36).substring(2, 15),
      title: newTodo,
      completed: false,
    };

    setTodos([newTodoItem, ...todos]);
    setNewTodo('');
  };

  const deleteTodo = id => {
    setTodos(prevState => prevState.filter(todo => todo.id !== id));
  };

  const handleEditClick = (id, title) => {
    setEditingTodoId(id);
    setEditedTitle(title);
  };

  const handleSaveEdit = id => {
    setTodos(prevState =>
      prevState.map(todo =>
        todo.id === id ? { ...todo, title: editedTitle || todo.title } : todo
      )
    );
    setEditingTodoId(null);
  };

  return (
    <div className="container">
      <h1 className="display-1 text-center">Todo List</h1>
      <br />
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={newTodo}
              onChange={handleInputChange}
              placeholder="Add a new todo..."
            />
            <button className="btn btn-md btn-outline-primary" type="button" onClick={addTodo}>
              Add
            </button>
          </div>
          {todos.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {todos.map(todo => (
                  <tr key={todo.id} className="table-hover">
                    <td>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleCheckboxChange(todo.id, !todo.completed)}
                      />
                    </td>
                    <td>
                      {editingTodoId === todo.id ? (
                        <div className="d-flex">
                          <input
                            type="text"
                            className="form-control"
                            value={editedTitle}
                            onChange={e => setEditedTitle(e.target.value)}
                          />
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => handleSaveEdit(todo.id)}
                          >
                            <i className="bi bi-check"></i>
                          </button>
                        </div>
                      ) : (
                        <span>{todo.title}</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {editingTodoId !== todo.id && (
                          <button
                            onClick={() => handleEditClick(todo.id, todo.title)}
                            className="btn btn-sm btn-info"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        )}
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No todos yet!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
