import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import Stack from 'react-bootstrap/Stack';
import { PencilSquare, Trash, Check2 } from 'react-bootstrap-icons';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/todos`,
        { withCredentials: true }
      );
      setTodos(res.data);
      setError('');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError('Failed to fetch todos');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      setError('Task cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/todos`,
        { task: newTodo, completed: false },
        { withCredentials: true }
      );
      setNewTodo('');
      await fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
      setError(error.response?.data?.message || 'Failed to add todo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTodo = async (todoId, updatedTask, completed) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/todos/${todoId}`,
        { 
          task: updatedTask, 
          completed: completed !== undefined ? completed : false 
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        setEditingId(null);
        await fetchTodos();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      setError(error.response?.data?.message || 'Failed to update todo');
      
      if (error.response) {
        console.log('Server responded with:', error.response.data);
        console.log('Status code:', error.response.status);
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error setting up request:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/todos/${todoId}`,
        { withCredentials: true }
      );
      await fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError(error.response?.data?.message || 'Failed to delete todo');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCompletion = async (todo) => {
    await handleUpdateTodo(todo._id, todo.task, !todo.completed);
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.task);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Your Todos</h1>
      
      {/* Todo Input Form */}
      <Form onSubmit={handleAddTodo} className="mb-4">
        <Form.Group controlId="todoInput" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => {
              setNewTodo(e.target.value);
              setError('');
            }}
            disabled={isLoading}
          />
        </Form.Group>
        <Form.Check
          type="checkbox"
          label="Mark as completed"
          id="completedCheckbox"
          className="mb-3"
        />
        <Button 
          type="submit" 
          variant="primary"
          disabled={isLoading || !newTodo.trim()}
        >
          {isLoading ? 'Adding...' : 'Add Task'}
        </Button>
      </Form>

      {/* Error Message */}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      {/* Loading State */}
      {isLoading && !todos.length && <p>Loading your todos...</p>}

      {/* Todos List */}
      {todos.length > 0 ? (
        <ListGroup>
          {todos.map((todo) => (
            <ListGroup.Item key={todo._id} className="py-3">
              {editingId === todo._id ? (
                <Stack direction="horizontal" gap={3}>
                  <Form.Control
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="me-auto"
                  />
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleUpdateTodo(todo._id, editText, todo.completed)}
                    disabled={!editText.trim()}
                  >
                    <Check2 />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </Button>
                </Stack>
              ) : (
                <Stack direction="horizontal" gap={3}>
                  <Form.Check
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompletion(todo)}
                    className="me-2"
                  />
                  <span 
                    className={`me-auto ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}
                  >
                    {todo.task}
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => startEditing(todo)}
                    disabled={isLoading}
                  >
                    <PencilSquare />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteTodo(todo._id)}
                    disabled={isLoading}
                  >
                    <Trash />
                  </Button>
                </Stack>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        !isLoading && <p>No todos yet. Add your first task!</p>
      )}
    </Container>
  );
}

export default Todos;