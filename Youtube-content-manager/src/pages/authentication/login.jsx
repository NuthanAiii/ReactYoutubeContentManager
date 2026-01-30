import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom' 
import './login.css'
import * as apiCallSerive from '../../services/apiCallSerive';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../slices/authSlice';


const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSignUp, setIsSignUp] = useState(false);

    const {
        register: loginform,
        handleSubmit: userLogin,
        reset:loginReset,
        formState: { errors, isValid, touchedFields }
    } = useForm({
        mode: 'onChange', // Validate on change
        defaultValues: {
            name: '',
            userName: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            let params;
            if (!isSignUp) {
                 params = new URLSearchParams();
                params.append("username", data.userName);
                params.append("password", data.password);
            }
            else{
                params = {
                    name: data.name,
                    email: data.userName,
                    password: data.password
                };
            }
            

            const endpoint = isSignUp ? 'signIn' : 'login';
            const res = await apiCallSerive.postData(endpoint, params);

            // If API returns access token, auto-login
            if (res?.access_token) {
                // store token in session and minimal user info in redux
                const userPayload = { username: data.userName, token: res.access_token };
                dispatch(login(userPayload))

                sessionStorage.setItem('authToken', res.access_token);
                toast.success(isSignUp ? 'Account created. Logged in!' : 'Login successful');
                loginReset();
                navigate('/dashboard', { replace: true });
            } else {
                // Created but no token - ask user to login
                toast.success(isSignUp ? 'Account created. Please login.' : 'Login successful');
                loginReset();
                if (isSignUp) setIsSignUp(false);
                if (!isSignUp) navigate('/dashboard', { replace: true });
            }
        }
        catch (err) {
            loginReset();
            const message = err?.response?.data?.detail || err.message || (isSignUp ? 'Sign up failed' : 'Login failed');
            console.error('Auth failed:', message);
            toast.error(message);
        }

    }


    return (
        <div className='login-page'>
            <div className='login-card'>
                <div className='login-header'>
                    <p className='eyebrow'>Access your workspace</p>
                   {isSignUp ? <h1> Sign In</h1> : <h1>Login</h1>} 
                    <p className='subtext'>Manage your ideas and uploads in one place.</p>
                </div>
                <form onSubmit={userLogin(onSubmit)}>
{isSignUp && (
                    <div className='form-group'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            {...loginform('name', {
                                required: 'Name is required',
                                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                validate: (value) => value.trim() ? true : 'Name is required'
                            })}
                            placeholder="Enter full name"
                            className={touchedFields.name && errors.name ? 'input-error' : ''}
                        />
                        {touchedFields.name && errors.name && (
                            <span className="error-message">{errors.name.message}</span>
                        )}
                    </div>
                    )}

                    <div className='form-group'>
                        <label htmlFor="userName">Username</label>
                        <input
                            type="text"
                            id="userName"
                            {...loginform('userName', {
                                required: 'Username is required',
                                minLength: {
                                    value: 3,
                                    message: 'Username must be at least 3 characters'
                                },
                                validate: (value) => {
                                    if (!value.trim()) {
                                        return 'Username is required';
                                    }
                                    return true;
                                }
                            })}
                            placeholder="Enter username"
                            className={touchedFields.userName && errors.userName ? 'input-error' : ''}
                        />
                        {touchedFields.userName && errors.userName && (
                            <span className="error-message">{errors.userName.message}</span>
                        )}
                    </div> 
                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...loginform('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
                            })}
                            placeholder="Enter password"
                            className={touchedFields.password && errors.password ? 'input-error' : ''}
                        />
                        {touchedFields.password && errors.password && (
                            <span className="error-message">{errors.password.message}</span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className='primary'
                        disabled={!isValid}
                    >
                        {isSignUp ? 'Sign Up' : 'Login'}
                    </button>
                </form>
                <div className='form-footer'>
                    <p className='toggle'>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button type='button' className='link' onClick={() => { setIsSignUp(!isSignUp); loginReset(); }}>
                            {isSignUp ? ' Login' : ' Sign Up'}
                        </button>
                    </p>
                    <p className='hint'>{isSignUp ? 'Create your account to start managing content.' : 'Demo flow: click login to view the dashboard.'}</p>
                </div>
            </div>
        </div>
    )

}

export default LoginPage