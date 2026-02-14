import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom' 
import './login.css'
import * as apiCallSerive from '../../services/apiCallSerive';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { loginAsync } from '../../slices/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';


const LoginPage = ({ setLoading }) => {
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
        if (setLoading) setLoading(true);
        try {
            let params;
            if (!isSignUp) {
                params = new URLSearchParams();
                params.append("username", data.userName);
                params.append("password", data.password);
            } else {
                params = {
                    name: data.name,
                    email: data.userName,
                    password: data.password
                };
            }

            if (isSignUp) {
                const res = await apiCallSerive.postData('signIn', params);
                if (res?.access_token) {
                    sessionStorage.setItem('authToken', res.access_token);
                    toast.success('Account created and logged in');
                    loginReset();
                    navigate('/dashboard', { replace: true });
                } else {
                    toast.success('Account created. Please login.');
                    loginReset();
                    setIsSignUp(false);
                }
            } else {
                try {
                    const action = await dispatch(loginAsync({ username: data.userName, password: data.password }));
                    const result = unwrapResult(action);
                    sessionStorage.setItem('authToken', result.token);
                    toast.success('Login successful');
                    loginReset();
                    navigate('/dashboard', { replace: true });
                } catch (thunkErr) {
                    const message = thunkErr || 'Login failed';
                    toast.error(message);
                }
            }
        } catch (err) {
            loginReset();
            const message = err?.response?.data?.detail || err.message || (isSignUp ? 'Sign up failed' : 'Login failed');
            console.error('Auth failed:', message);
            toast.error(message);
        } finally {
            if (setLoading) setLoading(false);
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
                        <label htmlFor="userName">User Email</label>
                        <input
                            type="text"
                            id="userName"
                            {...loginform('userName', {
                                required: 'User email is required',
                                
                                validate: (value) => {
                                    if (!value.trim()) {
                                        return 'User email is required';
                                    }
                                    // Email regex validation
                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                    if (!emailRegex.test(value)) {
                                        return 'Enter a valid email address';
                                    }
                                    return true;
                                }
                            })}
                            placeholder="Enter user email"
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
                        style={{ width: '100%', marginBottom: '0px' }}
                    >
                        {isSignUp ? 'Sign Up' : 'Login'}
                    </button>
                    {!isSignUp && (
                        <>
                        <div className="login-links-row" style={{ justifyContent: 'center', marginBottom: '2px' }}>
                            <button
                                type="button"
                                className="link forgot-password-btn"
                                onClick={() => navigate('/forgot-password')}
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <div className="login-links-row login-signup-center" style={{ justifyContent: 'center', marginTop: '0', gap: '6px' }}>
                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                                Don't have an account?
                            </span>
                            <button
                                type="button"
                                className="link signup-btn"
                                onClick={() => { setIsSignUp(true); loginReset(); }}
                            >
                                Sign Up
                            </button>
                        </div>
                        </>
                    )}
                </form>
                <div className='form-footer'>
                    {isSignUp ? (
                        <p className='toggle'>
                            Already have an account?
                            <button type='button' className='link' onClick={() => { setIsSignUp(false); loginReset(); }}>
                                Login
                            </button>
                        </p>
                    ) : null}
                    <p className='hint'>{isSignUp ? 'Create your account to start managing content.' : 'Demo flow: click login to view the dashboard.'}</p>
                </div>
            </div>
        </div>
    )

}

export default LoginPage