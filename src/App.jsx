import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './componentes/paginas/LoginPage'
import { Homed } from './componentes/Homed/Homed'
import { AuthProvider } from './context/AuthContext'


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
          <Route path="/profesor/*" element={<Homed/>}/>
      </Routes>
    </>
  )
}

export default App
