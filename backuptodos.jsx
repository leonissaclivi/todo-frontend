import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TodoCards from '../components/TodoCards';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function Todos() {
 const [todos, setTodos] = useState([]);
 const [newTodo, setNewTodo] = useState('');
 

  return (
    <div className='mt-4'>
      <Container>
      <Form>
  <Form.Group className="mb-3" controlId="formTaskName">
    <Form.Label>Task Name</Form.Label>
    <Form.Control 
      type="text" 
      placeholder="Enter task name" 
      required
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="formTaskCompleted">
    <Form.Check 
      type="checkbox" 
      label="Mark as completed" 
    />
  </Form.Group>

  <Button variant="primary" type="submit" className='mb-4'>
    Add Task
  </Button>
</Form>
      </Container>
      <Container>
      {todos.map((todo)=>(
        <TodoCards key={todo.id} todo={todo}/>
      ))}
      </Container>
    </div>
  )
}

export default Todos