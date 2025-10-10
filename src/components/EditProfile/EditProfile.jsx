import React, { useEffect, useRef, useState } from 'react'
import './EditProfile.css'
import { ArrowLeftIcon, Camera, Pen } from 'lucide-react';
import Button from '../Button/Button'
import GoBackBtn from '../GoBackBtn/GoBackBtn';
import axiosInstance, { uploadFile } from '../../service/axios';
import useAuth from '../../hook/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const navigate = useNavigate();

  const {auth, setAuth} = useAuth();

  const [newProfile, setNewProfile] = useState({
    username: auth?.user?.username,
    firstname: auth?.user?.firstname,
    lastname: auth?.user?.lastname,
    bio: auth?.user?.bio,
    profileUrl: auth?.user?.profileUrl,
  });
  const [previewImage, setPreviewImage] = useState();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const fileRef = useRef();

  const handleChange = (e) => {
    setNewProfile({
      ...newProfile,
      [e.target.name]: e.target.value,
    });
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // validate file type
    if (!file.type.startsWith('image/')) {
      // inform wrong file type
      console.error("Only accept image file");
      return;
    }

    // validate file size (max: 5mb)
    if (file.size > 5 * 1024 * 1024) {
      console.error("Image should be less than 5MB");
      return;
    }

    // create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    }
    reader.readAsDataURL(file);

  }

  const changeImageClick = (e) => {
    e.preventDefault();
    fileRef?.current?.click();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProfile && !fileRef?.current?.files[0]) return;

    setIsUpdatingProfile(true);

    let updatedProfle = {...newProfile};

    if (fileRef?.current?.files[0]) {
      try {
        const file = fileRef.current.files[0];

        const imageName = await uploadFile(file);
        updatedProfle.profileUrl = imageName;

      } catch (error) {
        console.error("Error when uploading file: ", error);
      }
    }

    try {
      const res = await axiosInstance.patch('/users', updatedProfle);  
      let newUserData = res.data;

      const newAuth = {
        ...auth,
        user: {
          ...auth.user,
          profileUrl: newUserData?.profileUrl,
          username: newUserData?.username,
          firstname: newUserData?.firstname,
          lastname: newUserData?.lastname,
          bio: newUserData?.bio,
        }
      }

      setAuth(newAuth);
      toast.success('Profile updated!');
      navigate('/profile');
    } catch (error) {
      console.error("Error update profile: ", error);
      toast.error('Error updating profile');
    } finally {isUpdatingProfile(false);}

  }

  return (
    <div className="edit-profile">
      <div className="edit-profile__header">
        <GoBackBtn />
        <div className="title edit-profile__title sidebar-title">Edit Profile</div>
      </div>
      <hr />
      <form className="edit-profile__form" onSubmit={handleSubmit}>
        <div className="edit-profile__profile">
          <div className="edit-profile_subtitle">
            <div>Profile Picture</div>
            <Button icon={Pen} text={'Change'} onClick={changeImageClick}/>
            <input type="file" ref={fileRef} style={{display: "none"}} onChange={handleImageChange}/>
          </div>
          <div className="edit-profile__profile-preview">
            <img src={previewImage ? previewImage : (auth?.user?.profileUrl || '/user.png')} alt="Profile image" />
            {/* <Camera /> */}
          </div>
        </div>
        <hr />
        <div className="edit-profile__inputs">
          <div className="edit-profile__left">
            <div className="edit-profile__firstname">
              <label htmlFor="firstname">First Name:</label>
              <input 
                type="text" 
                name='firstname' 
                id='firstname' 
                value={newProfile?.firstname}
                className='input' 
                onChange={handleChange}
              />
            </div>
            <div className="edit-profile__lastname">
              <label htmlFor="lastname">Lastname:</label>
              <input 
                type="text" 
                name='lastname' 
                id='lastname' 
                value={newProfile?.lastname}
                className='input' 
                onChange={handleChange}
              />
            </div>
            <div className="edit-profile__username">
              <label htmlFor="username">Username:</label>
              <input 
                type="text" 
                name='username' 
                id='username' 
                value={newProfile?.username}
                className='input' 
                onChange={handleChange}
              />
            </div>            
          </div>
          <div className="edit-profile__bio edit-profile__right">
            <label htmlFor="bio">Bio:</label>
            <textarea 
              type="text" 
              name='bio' 
              id='bio' 
              value={newProfile?.bio}
              className='input' 
              onChange={handleChange}
            />
          </div>
        </div>
        <Button text={'Save'} loading={isUpdatingProfile}/>
      </form>
    </div>
  )
}

export default EditProfile;