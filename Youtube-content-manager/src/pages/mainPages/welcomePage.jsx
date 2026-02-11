import React from 'react'
import { useNavigate } from 'react-router-dom'
import './welcome.css'

const WelcomePage =({ setLoading })=>{

 const navigate=useNavigate()
    return(

        <div className='welcome-page'>
            <div className='welcome-card'>
                <p className='eyebrow'>Creator Control Center</p>
                <h1>Welcome to the Youtube Content Manager</h1>
                <p className='subtext'>
                    Plan, track, and launch your videos with a clean, simple dashboard.
                </p>
                <button className='primary' onClick={() => navigate('/login')}>
                        Get Started
                </button>
            </div>
        </div>
    )
}

export default WelcomePage