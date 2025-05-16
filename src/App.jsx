import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './componentes/paginas/LoginPage'


function App() {
  return (
    <>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </>
  )
}

function Main() {
  return (
    <>
      <Routes>
        <Route path="" element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
