import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import http from '../lib/http'


const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submitLogin(e) {
    e.preventDefault()
    try {
      const response = await http.post('/login', form)
      localStorage.setItem('access_token', response.data.access_token)
      navigate('/')
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    }
  }

  async function handleCredentialResponse(response) {
    try {
      const balikan = await http.post('/google-login', {
        googleToken: response.credential
      })
      localStorage.setItem('access_token', balikan.data.access_token)
      navigate('/')
    } catch (error) {
      let errorMessage = 'Something went wrong!'
      if (error.response) {
        errorMessage = error.response.data.message
      }

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  function handleInitializeGoogleLogin() {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_API_KEY,
        callback: handleCredentialResponse,
        locale: 'en'
      })
      window.google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
        }
      )
    }
  }

  useEffect(() => {
    handleInitializeGoogleLogin()
  }, [])

  if (localStorage.getItem('access_token')) {
    return <Navigate to='/' />
  }

  return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-white"
        >
      <form
        onSubmit={submitLogin}
        className="p-4 p-md- shadow rounded-4"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#fff'
        }}
      >
        <div className="mb-4 text-center">
          <h2 className="fw-bold" style={{ color: '#000066' }}>
            Welcome Back
          </h2>
          <p className="text-muted">Login to your account</p>
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
          Login
        </button>

        <div className="my-4 text-center text-muted">OR</div>

        <div id="google-btn" className="w-100 d-flex justify-content-center"></div>

        <div className="text-center mt-4">
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: '#000066' }}>
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>


  )
}

export default Login
