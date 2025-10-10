import React from 'react'
import './ChangePassword.css'
import { ArrowLeftIcon, Pen } from 'lucide-react'
import Button from '../Button/Button'
import GoBackBtn from '../GoBackBtn/GoBackBtn'
import { useState } from 'react'
import axiosInstance from '../../service/axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const ChangePassword = () => {
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmNewPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwords.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const updatedUser = await axiosInstance.patch('/users/me/password', passwords);
      
      console.log("Password changed successfully!");
      toast.success('Password has been changed');
      if(updatedUser) navigate('/profile');
    } catch (err) {
      console.error('Error changing password:', err);
      
      const errorData = err.response?.data?.error;
    
      // Check for validation errors first
      if (errorData?.details && Array.isArray(errorData.details)) {
          // Show first validation error
          setError(errorData.details[0].msg);
      } else {
          // Show generic error message
          setError(errorData?.msg || 'Failed to change password');
      }

      toast.error('Change password failed')

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <div className="change-password__header">
        <GoBackBtn />
        <div className="title change-password__title sidebar-title">Change Password</div>
      </div>
      <form className="change-password__form" onSubmit={handleSubmit}>
        <hr />
        <div className="change-password__old-password">
          <label htmlFor="oldPassword">Enter old password:</label>
          <input 
            type="password" 
            name='oldPassword' 
            id='oldPassword' 
            className='input' 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="change-password__new-password">
          <label htmlFor="newPassword">Enter new password:</label>
          <input 
            type="password" 
            name='newPassword' 
            id='newPassword' 
            className='input' 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="change-password__new-password">
          <label htmlFor="confirmNewPassword">Confirm new password:</label>
          <input 
            type="password" 
            name='confirmNewPassword' 
            id='confirmNewPassword' 
            className='input' 
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        {error && <div className='error'>{error}</div>}
        <Button text={'Save'} loading={loading}/>
      </form>
    </div>
  )
}

export default ChangePassword