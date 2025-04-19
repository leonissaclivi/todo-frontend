import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Singup from './pages/Singup';
import Header from './components/Header';
import Todos from './pages/Todos';

function App() {
  const [todos, setTodos] = useState([
    {id:1,name:"wake up", completed:true},
    {id:2,name:"work out", completed:false}
  ])
  return (
    <div>
      
      <Router>
   
        <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Singup/>}/>
        <Route path='/todos' element={<Todos todos={todos}/>}/>
        <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App  