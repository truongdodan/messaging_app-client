import React from 'react'
import './ChangePassword.css'
import { ArrowLeftIcon, Pen } from 'lucide-react'
import Button from '../Button/Button'
import GoBackBtn from '../GoBackBtn/GoBackBtn'

const ChangePassword = () => {
  return (
    <div className="change-password">
      <div className="change-password__header">
        <GoBackBtn />
        <div className="title change-password__title sidebar-title">Change Password</div>
      </div>
      <form className="change-password__form">
        <hr />
        <div className="change-password__old-password">
          <label htmlFor="oldPassword">Enter old password:</label>
          <input type="password" name='oldPassword' id='oldPassword' className='input'/>
        </div>
        <div className="change-password__new-password">
          <label htmlFor="newPassword">Enter new password:</label>
          <input type="password" name='newPassword' id='newPassword' className='input'/>
        </div>
        <div className="change-password__new-password">
          <label htmlFor="confirmNewPassword">Confirm new password:</label>
          <input type="password" name='confirmNewPassword' id='confirmNewPassword' className='input'/>
        </div>
        <Button text={'Save'}/>
      </form>
    </div>
  )
}

export default ChangePassword