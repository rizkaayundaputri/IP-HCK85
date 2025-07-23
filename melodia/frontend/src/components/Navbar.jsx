import React from 'react'
import { NavLink, useNavigate } from 'react-router'
import { FaHome, FaMusic, FaUser } from 'react-icons/fa'

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          Noisely
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarContent">
          <ul className="navbar-nav d-flex flex-row gap-4">
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/">
                <FaHome className="me-2" /> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/collections">
                <FaMusic className="me-2" /> My Playlist
              </NavLink>
            </li>
            <li className="nav-item">
              <a className="nav-link d-flex align-items-center" 
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    localStorage.removeItem('access_token');
                    navigate('/login');
                }}
              >
                <FaUser className="me-2" /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar