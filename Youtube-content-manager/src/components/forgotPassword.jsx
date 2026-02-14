import React from 'react';
import { set, useForm } from 'react-hook-form';
import './forgotPassword.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as apiCallSerive from '../services/apiCallSerive';
import { useState } from 'react';


const ForgotPassword = ({setLoading}) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid, touchedFields }
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            newPassword: '',
            confirmPassword: ''
        }
    });
 const navigate = useNavigate();
    const newPassword = watch('newPassword');
    const confirmPassword = watch('confirmPassword');

    const onSubmit = async(data) => {
        setLoading(true);
        
            // onSave(data.newPassword)
            const payload = {
                email: data.email,
                new_password: data.newPassword
            }
            await apiCallSerive.postData('changePassword', payload);
            toast.success('Password reset successful. Please login with your new password.');
            sessionStorage.removeItem('authToken');
            navigate('/login');
            setLoading(false);
            
            

        
    };

    return (
        <div className="forgot-password-container">
            <form className="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
                <h2>Forgot Password</h2>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address'
                            }
                        })}
                        className={touchedFields.email && errors.email ? 'input-error' : ''}
                    />
                    {touchedFields.email && errors.email && (
                        <span className="error-message">{errors.email.message}</span>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Enter new password"
                        {...register('newPassword', {
                            required: 'New password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                        className={touchedFields.newPassword && errors.newPassword ? 'input-error' : ''}
                    />
                    {touchedFields.newPassword && errors.newPassword && (
                        <span className="error-message">{errors.newPassword.message}</span>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm new password"
                        {...register('confirmPassword', {
                            required: 'Confirm password is required',
                            validate: value =>
                                value === newPassword || 'Passwords do not match'
                        })}
                        className={touchedFields.confirmPassword && errors.confirmPassword ? 'input-error' : ''}
                    />
                    {touchedFields.confirmPassword && errors.confirmPassword && (
                        <span className="error-message">{errors.confirmPassword.message}</span>
                    )}
                </div>
                <button type="submit" className="primary" disabled={!isValid}>
                    Save
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
