import { Navigate, Outlet } from "react-router-dom";


const RouteGuard = () =>{
    const login = sessionStorage.getItem('authToken') || false;
    if(!login){
        return <Navigate to={'/login'}  replace />
    }else{
        return <Outlet />
    }

}

export default RouteGuard