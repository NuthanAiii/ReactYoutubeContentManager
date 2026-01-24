import React from 'react'
import {Routes , Route } from 'react-router-dom'
import DashboardPage from '../../pages/mainPages/dashboardPage'
import WelcomePage from '../../pages/mainPages/welcomePage'
import LoginPage from '../../pages/mainPages/login'
import RouteGuard from '../routeGuard'
const AppRoute = () =>{
    return(
        <Routes>
            <Route element={<RouteGuard/>}>
                <Route path='/dashboard' element={<DashboardPage />} />
            </Route>
            <Route path='/' element={<WelcomePage />} />
            <Route path='/login' element={<LoginPage />} /> 
           
        </Routes>
    )
}

export default AppRoute