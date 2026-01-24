import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import './login.css'

const LoginPage = () => {
    const navigate = useNavigate();
    
    const {
        register: loginform,
        handleSubmit:login,
        formState: { errors, isValid, touchedFields }
    } = useForm({
        mode: 'onChange', // Validate on change
        defaultValues: {
            userName: '',
            password: ''
        }
    });

    const onSubmit = (data) => {
        console.log('login', data);
        sessionStorage.setItem("login", true)
        // Reset form after login
        navigate('/dashboard');
    }


    return(
        <div className='login-page'>
            <div className='login-card'>
                <div className='login-header'>
                    <p className='eyebrow'>Access your workspace</p>
                    <h1>Login</h1>
                    <p className='subtext'>Manage your ideas and uploads in one place.</p>
                </div>
                <form onSubmit={login(onSubmit)}>
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
                        Login
                    </button>
                </form>
                <p className='hint'>Demo flow: click login to view the dashboard.</p>
            </div>
        </div>
    )

}

export default LoginPage