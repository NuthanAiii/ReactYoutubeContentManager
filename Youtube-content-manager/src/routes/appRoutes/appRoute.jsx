import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardPage from '../../pages/mainPages/dashboardPage'
import WelcomePage from '../../pages/mainPages/welcomePage'
import LoginPage from '../../pages/authentication/login'
import ForgotPasswordPage from '../../components/forgotPassword'
import RouteGuard from '../mainRoutes/routeGuard'
import PrivateGuard from '../mainRoutes/privateGuard'
const AppRoute = ({ setLoading }) => {
    return (
        <Routes>
            <Route element={<RouteGuard />}>
                <Route path='/dashboard' element={<DashboardPage setLoading={setLoading} />} />
            </Route>
            <Route element={<PrivateGuard />}>
                <Route path='/' element={<WelcomePage setLoading={setLoading} />} />
                <Route path='/login' element={<LoginPage setLoading={setLoading} />} />
            </Route>
            <Route path='/forgot-password' element={<ForgotPasswordPage setLoading={setLoading} />} />
        </Routes>
    )
}

export default AppRoute