import React, { useEffect, useState } from 'react'
import './Profile.css'
import Button from '../Button/Button'
import { Camera } from 'lucide-react'
import useAuth from '../../hook/useAuth'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../service/axios'
import useConversation from '../../hook/useConversation'

const Profile = () => {
    const {auth} = useAuth();
    const {directConversationItems, conversationItemsLoading} = useConversation();
    const navigate = useNavigate();
    const {userId} = useParams();
    const [currentDisplayUser, setCurrentDisplayUser] = useState();
    const [currentDisplayUserLoading, setCurrentDisplayUserLoading] = useState(true);

    // get user
    useEffect(() => {
        if (!userId) {  // if in the login user profile
            setCurrentDisplayUser(auth.user);
        } else {
            axiosInstance.get(`/users/${userId}`)
            .then(res => {
                setCurrentDisplayUser(res.data);
            })
            .catch(err => {
                console.error(err);
            })
        }
    }, []);

    // set loading after set current display user
    useEffect(() => {
        if (currentDisplayUser) {
            setCurrentDisplayUserLoading(false);
        }
    }, [currentDisplayUser]);

    if (currentDisplayUserLoading) return <div>Loading user profile...</div>

  return (
    <div className="profile">
        <div className="profile__pictures">
            <div className="profile__cover-photo">
                <img src={currentDisplayUser?.coverUrl ? currentDisplayUser?.coverUrl : "/calm-night.gif"} alt="cover photo" />
                <div className="icon-container">
                    <Camera />
                </div>
            </div>
            <div className="profile__profile-picture">
                <img src={currentDisplayUser?.coverUrl ? currentDisplayUser?.profileUrl : "/user.png"} alt="profile picture" />
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