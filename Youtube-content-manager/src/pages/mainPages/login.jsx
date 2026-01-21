import React from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

const LoginPage =() => {

    const navigate = useNavigate()

    return(
        <div className='login-page'>
            <div className='login-card'>
                <div className='login-header'>
                    <p className='eyebrow'>Access your workspace</p>
                    <h1>Login</h1>
                    <p className='subtext'>Manage your ideas and uploads in one place.</p>
                </div>
                <div className='form-group'>
                    <label>Username</label>
                    <input type="text" placeholder="Enter username" />
                </div>
                <div className='form-group'>
                    <label>Password</label>
                    <input type="password" placeholder="Enter password" />
                </div>
                <button className='primary' onClick={() => navigate('/dashboard')}>Login</button>
                <p className='hint'>Demo flow: click login to view the dashboard.</p>
            </div>
        </div>
    )

}

export default LoginPage