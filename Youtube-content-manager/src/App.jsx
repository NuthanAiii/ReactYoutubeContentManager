import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './layouts/header'
import DashboardPage from './pages/mainPages/dashboardPage'
import AppRoute from './routes/appRoutes/appRoute'
function App() {
  

  return (
   <div>
    
    <AppRoute />
   </div>
  )
}

export default App
