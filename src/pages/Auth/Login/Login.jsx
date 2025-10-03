import React from 'react'
import '../Auth.css'
import Button from '../../../components/Button/Button'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axiosInstance from '../../../service/axios'
import useAuth from '../../../hook/useAuth'
import { useEffect } from 'react'

const Login = () => {
    const {auth, setAuth} = useAuth();
    const [account, setAccount] = useState({
        email: "dodantruong333@gmail.com",
        password: "Strongp@ssword123",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/chats";

    const handleChange = (e) => {
        setAccount({
            ...account,
            [e.target.name]: e.target.value,
        });

        // reset error
        setError("");
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axiosInstance.post("/login", account) 
            .then(res => {
                setAuth({
                    accessToken: res.data.accessToken,
                    user: res.data.user,
                })
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.response.data.error.msg);
            })
    }

    useEffect(() => {
        if (isLoading === false && auth) {
            navigate(from, {replace: true});
        } /* else {
            setError("There is error when trying to login");
        } */
    }, [isLoading]);

  return (
    <div className="auth-wrapper">
        <img src="calm-night.gif" alt="Calm night pixel animation" className='bg-img'/>
        <div className='auth'>
            <div className="auth__logo">Something cool</div>
            <div className="auth__title">Log in</div>
            <form className="auth__form form--login" onSubmit={handleSubmit}>
                <div className="auth__input">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id='email' name='email' className='input' onChange={handleChange}/>
                </div>
                <div className="auth__input">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id='password' name='password' className='input'onChange={handleChange}/>
                </div>
                <div className="auth__navigate">
                    Don't have an account? <Link to={'/register'}>Sign up</Link>
                </div>
                {error && <div className="error">{error}</div>}
                <div className="auth__buttons">
                    <Button text={'Global Chat'} className={'navigate-btn'} onClick={() => {navigate("/global")}}/>
                    <Button text={'Submit'}/>
                </div>
            </form>
        </div>
        <div className="img-wrapper">
            <img src="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.qNfoguQF-UXY1F1MdXDXrAHaHY%3Fr%3D0%26pid%3DApi&sp=1756109780T19726f90bd4d4695c6414120513035b2bda4ee574a22416e138517cfa41f5e52" alt="logo" />
        </div>
    </div>
  ) 
}

export default Login;