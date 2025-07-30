import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import http from '../lib/http'

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submitRegister(e) {
    e.preventDefault()
    try {
      const response = await http.post('/register', form)
      navigate('/login')
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  if (localStorage.getItem('access_token')) {
    return <Navigate to="/" />
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <form
        onSubmit={submitRegister}
        className="p-4 p-md- shadow rounded-4"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#fff'
        }}
      >
        <div className="mb-4 text-center">
          <h2 className="fw-bold" style={{ color: '#000066' }}>
            Create Account
          </h2>
          <p className="text-muted">Join and explore the music</p>
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="form-control rounded-pill py-2 px-3"
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="form-control rounded-pill py-2 px-3"
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="form-control rounded-pill py-2 px-3"
          />
        </div>

        <button
          type="submit"
          className="btn w-100 rounded-pill py-2 mt-3"
          style={{
            backgroundColor: '#000000ff',
            color: 'white',
          }}
        >
          Register
        </button>

        <div className="text-center mt-4">
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            Already have an account?{" "}
            <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#000066' }}>
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Register
