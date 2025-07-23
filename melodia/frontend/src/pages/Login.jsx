import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import http from '../lib/http'

const Login = () => {
    const[form,setForm] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    function handleChange(e) {
        setForm({...form,[e.target.name]:e.target.value})
    }

    async function submitLogin(e) {
        e.preventDefault()
        try {
            const response = await http.post('/login',form)
            localStorage.setItem('access_token',response.data.access_token)
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
            console.log("Encoded JWT ID token: " + response.credential);
            try {
        const balikan = await http.post('/google-login', {
            googleToken: response.credential
        })
        console.log(balikan)
        localStorage.setItem('access_token', balikan.data.access_token)
        navigate('/')
        }
        catch (error) {
        console.log(error, "<<<");

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

    function handleInitializeGoogleLogin(){
        google.accounts.id.initialize({
          client_id: "260207133908-c4tbmnsv3g32or8tr2gjnl472frns19t.apps.googleusercontent.com",
          callback: handleCredentialResponse,
          locale: 'en'
        });
        google.accounts.id.renderButton(
          document.getElementById("google-btn"),
          { theme: "outline", size: "large", width:"100%" }  // customization attributes
        );
        // google.accounts.id.prompt(); // also display the One Tap dialog
      }
      

    useEffect(() => {
        handleInitializeGoogleLogin()
    }, [])

    if(localStorage.getItem('access_token')){
        return <Navigate to = "/"/>
    }


    return (
    <div className='row vh-100 align-items-center mx-5 text-start'>
        <div className='col d-none d-md-block'></div>
        <div className='col d-md-flex'>
            <form onSubmit={submitLogin}>
                <div>
                    <h1>Login to your Account</h1>
                    <p>Welcome back!</p>
                <div className="mb-3">
                    <input type="email" className="form-control" placeholder='Email' name='email' onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" placeholder='Password' name='password' onChange={handleChange}/>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-5">Login</button>
                </div>
                <div id="google-btn"></div>
                <div className='text-center mt-3'>
                    <p>You have account? <Link to='/register'> Register now</Link></p>
                </div>
        </form>
        </div>
        <div className='col'></div>
    </div>
  )
}

export default Login