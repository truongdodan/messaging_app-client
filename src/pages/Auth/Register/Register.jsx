import React, { useState } from 'react'
import '../Auth.css'
import Button from '../../../components/Button/Button'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axiosInstance from '../../../service/axios'

const Register = () => {
    const [newUser, setNewUser] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });

        // reset error
        setError('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axiosInstance.post("/register", newUser)
            .then(res => {
                // reset data
                setNewUser("");

                //navigate to login
                navigate("/login");
            })
            .catch(err => {
                console.error(err);
                setError(err.response.data.error.details[0].msg);
            })
    }

  return (
    <div className="auth-wrapper">
        <img src="calm-night.gif" alt="Calm night pixel animation" className='bg-img'/>
        <div className='auth'>
            <div className="auth__logo">Something cool</div>
            <div className="auth__title">Register</div>
            <form className="auth__form form--register" onSubmit={handleSubmit}>
                <div className="fullname">
                    <div className="auth__input">
                        <label htmlFor="firstname">First name:</label>
                        <input type="text" id='firstname' name='firstname' className='input' onChange={handleChange} required/>
                    </div>
                    <div className="auth__input">
                        <label htmlFor="lastname">Last name:</label>
                        <input type="text" id='lastname' name='lastname' className='input' onChange={handleChange} required/>
                    </div>    
                </div>
                <div className="auth__input">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id='email' name='email' className='input' required onChange={handleChange}/>
                </div>
                <div className="auth__input">
                    <label htmlFor="username">Username:</label>
                    <input type="username" id='username' name='username' className='input' required onChange={handleChange}/>
                </div>
                <div className="auth__input">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id='password' name='password' className='input' required onChange={handleChange}/>
                </div>
                <div className="auth__input">
                    <label htmlFor="confirmedPassword">Confirmed password:</label>
                    <input type="password" id='confirmedPassword' name='confirmedPassword' className='input' required onChange={handleChange}/>
                </div>
                <div className="auth__navigate">
                    Already have an account? <Link to={'/login'}>Login</Link>
                </div>
                {error && <div className="error">{error}</div>}
                <div className="auth__buttons">
                    <Button text={'Global Chat'} className={'navigate-btn'}/>
                    <Button text={'Submit'} type='submit'/>
                </div>
            </form>
        </div>
        <div className="img-wrapper">
            <img src="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.qNfoguQF-UXY1F1MdXDXrAHaHY%3Fr%3D0%26pid%3DApi&sp=1756109780T19726f90bd4d4695c6414120513035b2bda4ee574a22416e138517cfa41f5e52" alt="logo" />
        </div>
    </div>
  )
}

export default Register;