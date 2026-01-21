import React from 'react'
import {Routes , Route } from 'react-router-dom'
import DashboardPage from '../../pages/mainPages/dashboardPage'
import WelcomePage from '../../pages/mainPages/welcomePage'
import LoginPage from '../../pages/mainPages/login'
const AppRoute = () =>{
    return(
        <Routes>
            <Route path='/' element={<WelcomePage />} />
            <Route path='/login' element={<LoginPage />} /> 
            <Route path='/dashboard' element={<DashboardPage />} />
        </Routes>
    )
}

export default AppRoute