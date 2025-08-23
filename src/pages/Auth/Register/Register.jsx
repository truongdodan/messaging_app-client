import React from 'react'
import '../Auth.css'
import Button from '../../../components/Button/Button'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div className="auth-wrapper">
        <img src="calm-night.gif" alt="Calm night pixel animation" className='bg-img'/>
        <div className='auth'>
            <div className="auth__logo">Something cool</div>
            <div className="auth__title">Register</div>
            <form className="auth__form form--register">
                <div className="fullname">
                    <div className="auth__input">
                        <label htmlFor="firstname">First name:</label>
                        <input type="text" id='firstname' name='firstname' className='input'/>
                    </div>
                    <div className="auth__input">
                        <label htmlFor="lastname">Last name:</label>
                        <input type="text" id='lastname' name='lastname' className='input'/>
                    </div>    
                </div>
                <div className="auth__input">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id='email' name='email' className='input'/>
                </div>
                <div className="auth__input">
                    <label htmlFor="username">Username:</label>
                    <input type="username" id='username' name='username' className='input'/>
                </div>
                <div className="auth__input">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id='password' name='password' className='input'/>
                </div>
                <div className="auth__input">
                    <label htmlFor="confirmedPassword">Confirmed password:</label>
                    <input type="password" id='confirmedPassword' name='confirmedPassword' className='input'/>
                </div>
                <div className="auth__navigate">
                    Already have an account? <Link to={'/login'}>Login</Link>
                </div>
                <div className="auth__buttons">
                    <Button text={'Global Chat'} className={'navigate-btn'}/>
                    <Button text={'Submit'}/>
                </div>
            </form>
        </div>
        <div className="img-wrapper">
            <img src="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.tp6SXvAxTzK6GSDEurpsvgHaEJ%3Fpid%3DApi&sp=1754704786Tf2f186e8a49ddc08d925ffa027cc735ec7c1cb8a400500c5ff08e81fc5063159" alt="logo" />
        </div>
    </div>
  )
}

export default Register;