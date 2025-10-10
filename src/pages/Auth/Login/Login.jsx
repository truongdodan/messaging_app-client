import React from 'react'
import '../Auth.css'
import Button from '../../../components/Button/Button'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axiosInstance, { getFileUrl } from '../../../service/axios'
import useAuth from '../../../hook/useAuth'
import toast from 'react-hot-toast'

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
        setError('');
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

            toast.success('Login successfully');
            navigate(from, {replace: true});
        } catch (error) {
            const errorData = error.response?.data?.error;
        
            // Check if validation errors exist
            if (errorData?.details && Array.isArray(errorData.details)) {
                // Show first validation error
                const firstError = errorData.details[0];
                setError(firstError.msg || errorData.msg);
            } else {
                // Show generic error message
                console.error("Login failed: ", error);
                setError(errorData?.msg || toast.error('Login failed! Try again'));
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
                    <Button text={'Submit'} loading={isLoading}/>
                </div>
            </form>
        </div>
        <div className="img-wrapper">
            <img src="jj" alt="logo" />
        </div>
    </div>
  ) 
}

export default Login;