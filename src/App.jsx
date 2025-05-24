import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './componentes/paginas/LoginPage'
import { Homed } from './componentes/Homed/Homed'
import { AuthProvider } from './context/AuthContext'
import DasboardProfesor from './componentes/paginas/User/DasboardProfesor'


function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

function Main() {
  return (
    <>
      <Routes>
        <Route path="" element={<LoginPage />} />
        <Route path="/dasboard/*" element={<Homed/>}/>
          <Route path="/profesor/" element={<DasboardProfesor/>}/>
      </Routes>
    </>
  )
}

export default App
