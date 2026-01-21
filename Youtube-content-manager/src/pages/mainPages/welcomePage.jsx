import React from 'react'
import { useNavigate } from 'react-router-dom'

const WelcomePage =()=>{

 const navigate=useNavigate()
    return(

        <div>
            Welcome to the Youtube Content Manager
            <button onClick={() => navigate('/login')}>
                    Get Started
            </button>
        </div>
    )
}

export default WelcomePage