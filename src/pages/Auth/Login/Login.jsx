import React from 'react'
import '../Auth.css'
import Button from '../../../components/Button/Button'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axiosInstance, { getFileUrl } from '../../../service/axios'
import useAuth from '../../../hook/useAuth'
import { useEffect } from 'react'

const hoa = "dodantruong69@gmail.com";
const truongreal = "dodantruong333@gmail.com";
const gigachad = "deepbreathandtakeitslow999@gmail.com";
const truongfake = "dodantruong04@gmail.com";

const Login = () => {
    const {setAuth} = useAuth();
    const [account, setAccount] = useState({
        email: truongreal,
        password: "Strongp@ssword123",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);

        try {
            const loginUser = await axiosInstance.post('/login', account);
            await setAuth({
                accessToken: loginUser.data.accessToken,
                user: loginUser.data.user,
            })

            navigate(from, {replace: true});
        } catch (error) {
            console.error("Error when trying to login: ", error);
            const errorData = error.response?.data?.error;
        
            // Check if validation errors exist
            if (errorData?.details && Array.isArray(errorData.details)) {
                // Show first validation error
                const firstError = errorData.details[0];
                setError(firstError.msg || errorData.msg);
            } else {
                // Show generic error message
                setError(errorData?.msg || 'Login failed');
            }
        } finally {setIsLoading(false);}

    }

  return (
    <div className="auth-wrapper">
        <img src="calm-night.gif" alt="Calm night pixel animation" className='bg-img'/>
        <div className='auth'>
            <div className="auth__logo">Something cool</div>
            <div className="auth__title">Log in</div>
            <form className="auth__form form--login" onSubmit={handleSubmit}>
                <div className="auth__input">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id='email' name='email' className='input' onChange={handleChange} disabled={isLoading}/>
                </div>
                <div className="auth__input">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id='password' name='password' className='input'onChange={handleChange} disabled={isLoading}/>
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