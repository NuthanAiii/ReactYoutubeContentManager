import React from 'react'
import {Routes , Route } from 'react-router-dom'
import DashboardPage from '../../pages/mainPages/dashboardPage'
import WelcomePage from '../../pages/mainPages/welcomePage'
import LoginPage from '../../pages/authentication/login'

import RouteGuard from '../mainRoutes/routeGuard'
import PrivateGuard from '../mainRoutes/privateGuard'
const AppRoute = () =>{
    return(
        <Routes>
            <Route element={<RouteGuard/>}>
                <Route path='/dashboard' element={<DashboardPage />} />
            </Route>
            <Route element={<PrivateGuard/>}>
            <Route path='/' element={<WelcomePage />} />
            <Route path='/login' element={<LoginPage />} /> 

            </Route>
            
           
        </Routes>
    )
}

export default AppRoute