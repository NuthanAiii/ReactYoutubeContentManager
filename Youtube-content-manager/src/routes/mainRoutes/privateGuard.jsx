import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PrivateGuard =() =>{
    const location = useLocation();
    const navigate = useNavigate();
    const authToken = sessionStorage.getItem('authToken') || false;
    if(authToken){
        const redirectTo = location.state?.from || "/dashboard";
        return <Navigate to={redirectTo} replace />;
        
    }else{
        return <Outlet />
    }
}
export default PrivateGuard