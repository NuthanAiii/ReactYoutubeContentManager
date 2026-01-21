import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage =() => {

    const navigate = useNavigate()

    return(
        <div>
            <h1>Login</h1>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button onClick={() => navigate('/dashboard')}>Login</button>
        </div>
    )

}

export default LoginPage