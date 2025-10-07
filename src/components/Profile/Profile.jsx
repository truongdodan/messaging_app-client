import React, { useEffect, useRef, useState } from 'react'
import './Profile.css'
import Button from '../Button/Button'
import { Camera } from 'lucide-react'
import useAuth from '../../hook/useAuth'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance, { uploadFile } from '../../service/axios'
import useConversation from '../../hook/useConversation'

const Profile = () => {
    const {auth, setAuth} = useAuth();
    const navigate = useNavigate();
    const {userId} = useParams();
    const [currentDisplayUser, setCurrentDisplayUser] = useState();
    const [currentDisplayUserLoading, setCurrentDisplayUserLoading] = useState(true);
    const [uploadingCover, setUploadingCover] = useState(false);

    const coverFileRef = useRef();

    // get user
    useEffect(() => {
        if (!userId) {  // if in the login user profile
            setCurrentDisplayUser(auth.user);
            setCurrentDisplayUserLoading(false);
        } else {
            axiosInstance.get(`/users/${userId}`)
            .then(res => {
                setCurrentDisplayUser(res.data);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setCurrentDisplayUserLoading(false);
            })
        }
        
    }, [userId, auth?.user]);

    // Handle cover photo change
    const handleCoverChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.error("Only image files are allowed");
            return;
        }

        // Validate file size (max: 5mb)
        if (file.size > 5 * 1024 * 1024) {
            console.error("Image should be less than 5MB");
            return;
        }

        setUploadingCover(true);

        try {
            // Upload file to Supabase
            const imagePath = await uploadFile(file);

            // Update user profile with new cover
            const res = await axiosInstance.patch('/users', {
                firstname: auth.user.firstname,
                lastname: auth.user.lastname,
                username: auth.user.username,
                coverUrl: imagePath,
            });

            // Update auth context
            const newAuth = {
                ...auth,
                user: {
                    ...auth.user,
                    coverUrl: res.data.coverUrl,
                }
            };
            
            await setAuth(newAuth);
        } catch (error) {
            console.error('Error uploading cover photo:', error);
            console.error('Failed to update cover photo');
        } finally {
            setUploadingCover(false);
        }
    };

    const handleCameraClick = () => {
        // Only allow logged-in user to change their own cover
        if (!userId) {
            coverFileRef.current?.click();
        }
    };

    if (currentDisplayUserLoading) return <div>Loading user profile...</div>

  return (
    <div className="profile">
        <div className="profile__pictures">
            <div className="profile__cover-photo">
                <img src={currentDisplayUser?.coverUrl ? currentDisplayUser?.coverUrl : "/calm-night.gif"} alt="cover photo" />
                {!userId && (
                    <>
                        <div 
                            className="icon-container" 
                            onClick={handleCameraClick}
                            style={{cursor: uploadingCover ? 'not-allowed' : 'pointer'}}
                        >
                            <Camera />
                        </div>
                        <input 
                            type="file" 
                            ref={coverFileRef}
                            onChange={handleCoverChange}
                            accept="image/*"
                            style={{display: 'none'}}
                            disabled={uploadingCover}
                        />
                    </>
                )}
            </div>
            <div className="profile__profile-picture">
                <img src={currentDisplayUser?.profileUrl ? currentDisplayUser?.profileUrl : "/user.png"} alt="profile picture" />
                <div className="active-indicator online"></div>
            </div>
        </div>
        <div className="profile__information">
            <div className="profile__fullname">{currentDisplayUser?.lastname + " " + currentDisplayUser?.firstname}</div>
            <div className="profile__username">{currentDisplayUser?.username}</div>
            <div className="profile__bio">{currentDisplayUser?.bio}</div>
            <div className="profile__buttons">
                {
                    userId
                    ?   <Button text={'Send Message'} onClick={() => {navigate(`/chats/new/${userId}`)}}/>
                    :   <>
                            <Button text={'Edit Profile'} onClick={() => {navigate("/profile/edit")}} />
                            <Button text={'Change Password'} className={'profile__change-password-btn'} onClick={() => {navigate("/profile/changepassword")}}/>
                        </>
                }
            </div>
        </div>
    </div>
  )
}

export default Profile