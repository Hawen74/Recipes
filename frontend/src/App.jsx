import React from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from './pages/Home'
import Recipes from './pages/Recipes'

const App = () => {
  const headerStyle = {
    display: 'flex',
    gap: '12px',
    padding: '16px 24px',
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  }

  const buttonStyle = {
    padding: '10px 18px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontWeight: 600,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    boxShadow: '0 6px 14px rgba(37, 99, 235, 0.25)'
  }

  return (
    <BrowserRouter>
      <header style={headerStyle}>
        <Link to="/" style={buttonStyle}>Home</Link>
        <Link to="/recipes" style={buttonStyle}>Recipes</Link>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App