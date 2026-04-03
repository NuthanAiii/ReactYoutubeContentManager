import './App.css'
import AppRoute from './routes/appRoutes/appRoute'
import React, { useEffect, useRef } from 'react';
import Loader from './components/loader';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from './slices/authSlice';

function App() {
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const timerRef = useRef(null);

    const handleExpiry = () => {
        sessionStorage.removeItem('authToken');
        dispatch(logOut());
        clearTimeout(timerRef.current);
        navigate('/login', { replace: true });
    };

    const scheduleExpiry = () => {
        const token = sessionStorage.getItem('authToken');
        if (!token) return;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const msUntilExpiry = payload.exp * 1000 - Date.now();
            if (msUntilExpiry <= 0) {
                handleExpiry();
                return;
            }
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(handleExpiry, msUntilExpiry);
        } catch {}
    };

    useEffect(() => {
        scheduleExpiry();
        window.addEventListener('auth:expired', handleExpiry);
        window.addEventListener('auth:login', scheduleExpiry);
        return () => {
            window.removeEventListener('auth:expired', handleExpiry);
            window.removeEventListener('auth:login', scheduleExpiry);
            clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div>
            <AppRoute setLoading={setLoading} />
            <Loader visible={loading} />
        </div>
    );
}

export default App
