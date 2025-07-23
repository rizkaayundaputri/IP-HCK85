import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router'
import Navbar from '../components/Navbar'


const PublicLayout = () => {

    const navigate = useNavigate()

     if (!localStorage.getItem('access_token')) {
        return (
        <div className="custom-bg text-dark">
            <div className="d-flex align-items-center justify-content-center min-vh-100 px-2">
            <div className="text-center">
                <h1 className="display-1 fw-bold">401</h1>
                <p className="fs-2 fw-medium mt-4">Oops! Unauthorized</p>
                <p className="mt-4 mb-5">Please login first to access this page!</p>
                <Link to="/login" className="btn btn-light fw-semibold rounded-pill px-4 py-2 custom-btn">
                Go Login
                </Link>
            </div>
            </div>
        </div>

        )
    }
    return (
        <>
        <Navbar />
        <Outlet />
        </>

    )
}

export default PublicLayout