import React from 'react'
import '../Auth.css'
import Button from '../../../components/Button/Button'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className="auth-wrapper">
        <img src="calm-night.gif" alt="Calm night pixel animation" className='bg-img'/>
        <div className='auth'>
            <div className="auth__logo">Something cool</div>
            <div className="auth__title">Log in</div>
            <form className="auth__form form--login">
                <div className="auth__input">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id='email' className='input'/>
                </div>
                <div className="auth__input">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id='password' className='input'/>
                </div>
                <div className="auth__navigate">
                    Don't have an account? <Link to={'/register'}>Sign up</Link>
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

export default Login;