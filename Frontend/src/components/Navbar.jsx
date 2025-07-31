import { Link } from 'react-router-dom'

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">TODO App</Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/todolists">My Lists</Link>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar