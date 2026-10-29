import { useState } from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import Home from "./pages/home.jsx";
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";


function App() {

  return (
    <>
    <Routes>
    <Route path="/" element={<Signup/>}></Route>
    <Route path="/home" element={<Home/>}></Route>
    <Route path="/login" element={<Login/>}></Route>
      
    </Routes>
          </>
  )
}

export default App
