import React from 'react'
import './Profile.css'
import Button from '../Button/Button'
import { Camera } from 'lucide-react'

const coverUrl = 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.tp6SXvAxTzK6GSDEurpsvgHaEJ%3Fr%3D0%26pid%3DApi&sp=1755345256T215886c25fbad91e8535f2a7d3d3e8a0477da4fc5a5cf2f071355d00d82ea211';
const profileUrl = 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse1.explicit.bing.net%2Fth%2Fid%2FOIP.P77h9IXLQi-ya-zxlfzt8QHaGy%3Fr%3D0%26pid%3DApi&sp=1755345256T97124f3590d3fda49d251bd0f06d2ccc1fd7d0bdcbb1ab036615336d6f855890';

const Profile = () => {
  return (
    <div className="profile">
        <div className="profile__pictures">
            <div className="profile__cover-photo">
                <img src={coverUrl} alt="cover photo" />
                <div className="icon-container">
                    <Camera />
                </div>
            </div>
            <div className="profile__profile-picture">
                <img src={profileUrl} alt="profile picture" />
                <div className="active-indicator online"></div>
            </div>
        </div>
        <div className="profile__information">
            <div className="profile__fullname">Do Dan Truong</div>
            <div className="profile__username">@dantRuongdo</div>
            <div className="profile__bio">Megalodon level pro gamer. Megalodon level pro gamer.Megalodon level pro gamer.Megalodon level pro gamer.Megalodon level pro gamer.</div>
            <div className="profile__buttons">
                <Button text={'Edit Profile'}/>
                <Button text={'Change Password'} className={'profile__change-password-btn'}/>
            </div>
        </div>
    </div>
  )
}

export default Profile