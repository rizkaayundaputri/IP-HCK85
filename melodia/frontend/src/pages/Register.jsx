import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import http from '../lib/http'

const Register = () => {
  const[form,setForm] = useState({
        name: "",
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    function handleChange(e) {
        setForm({...form,[e.target.name]:e.target.value})
    }

    async function submitRegister(e) {
        e.preventDefault()
        try {
            const response = await http.post('/register',form)
            navigate('/login')
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Something went wrong',
                icon: 'error',
                confirmButtonText: 'Cool'
                })
        }
    }
    
    if(localStorage.getItem('access_token')){
        return <Navigate to = "/"/>
    }
    return (
    <div className='row vh-100 align-items-center mx-5 text-start'>
        <div className='col d-none d-md-block'></div>
        <div className='col d-md-flex'>
            <form onSubmit={submitRegister}>
                <div>
                    <h1>Crreate your account</h1>
                    <p>Join many clubs here!</p>
                <div className="mb-3">
                    <input type="text" className="form-control" placeholder='Name' name='name' onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <input type="email" className="form-control" placeholder='Email' name='email' onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" placeholder='Password' name='password' onChange={handleChange}/>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-5">Register</button>
                </div>
                <div className='text-center mt-3'>
                    <p>You have account? <Link to='/login'> Login now</Link></p>
                </div>
        </form>
        </div>
        <div className='col'></div>
    </div>
  )
}

export default Register