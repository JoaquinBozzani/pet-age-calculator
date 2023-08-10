import React from 'react';
import './App.css'
import Navbar from './components/Navbar'
import Calculator from './components/Calculator'
import SceneInit from './components/SceneInit'



function App() {

  return (
    <div>
      <SceneInit></SceneInit>
      <Navbar></Navbar>
      <Calculator></Calculator>
    </div>
  )
}

export default App
