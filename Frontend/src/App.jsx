import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import TodoLists from './components/TodoLists'
import TodoItems from './components/TodoItems'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true)
    }
  }, [token])

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <div className="content-container">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/todolists" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/todolists" />} />
            <Route path="/todolists" element={isAuthenticated ? <TodoLists token={token} /> : <Navigate to="/login" />} />
            <Route path="/todolists/:listId" element={isAuthenticated ? <TodoItems token={token} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/todolists" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App