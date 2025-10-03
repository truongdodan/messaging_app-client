import React from 'react'
import './EditProfile.css'
import { ArrowLeftIcon, Camera, Pen } from 'lucide-react';
import Button from '../Button/Button'
import GoBackBtn from '../GoBackBtn/GoBackBtn';

const EditProfile = () => {
  return (
    <div className="edit-profile">
      <div className="edit-profile__header">
        <GoBackBtn />
        <div className="title edit-profile__title sidebar-title">Edit Profile</div>
      </div>
      <hr />
      <form className="edit-profile__form">
        <div className="edit-profile__profile">
          <div className="edit-profile_subtitle">
            <div>Profile Picture</div>
            <Button icon={Pen} text={'Change'}/>
          </div>
          <div className="edit-profile__profile-preview">
            <img src="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fthf.bing.com%2Fth%2Fid%2FOIP.PjVYkxU9_jpaHMtD1ZU2NwHaHW%3Fr%3D0%26cb%3Dthfc1%26pid%3DApi&sp=1754625227T193693d80ff26d9fdc4d10c117612cece04b4211fed3b2f987549d03a2e1f619" alt="Profile image" />
            {/* <Camera /> */}
          </div>
        </div>
        <hr />
        <div className="edit-profile__inputs">
          <div className="edit-profile__left">
            <div className="edit-profile__firstname">
              <label htmlFor="firstname">First Name:</label>
              <input type="text" name='firstname' id='firstname' className='input'/>
            </div>
            <div className="edit-profile__lastname">
              <label htmlFor="lastname">Lastname:</label>
              <input type="text" name='lastname' id='lastname' className='input'/>
            </div>
            <div className="edit-profile__username">
              <label htmlFor="username">Username:</label>
              <input type="text" name='username' id='username' className='input'/>
            </div>            
          </div>
          <div className="edit-profile__bio edit-profile__right">
            <label htmlFor="bio">Bio:</label>
            <textarea type="text" name='bio' id='bio' className='input'/>
          </div>
        </div>
        <Button text={'Save'}/>
      </form>
    </div>
  )
}

export default EditProfile;