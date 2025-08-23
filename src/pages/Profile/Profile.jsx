import React from 'react'
import './Profile.css'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from 'lucide-react'

const Tab = () => {
  return (
    <div className='profile__tab'>
        
    </div>
  )
}

const Profile = () => {
  const location = useLocation();

  return (
    <div className='profile'>
        <aside>
            <div className='sidebar-title'>Manage Profile</div>
            <div className="profile__tabs">
              <Link to={"/profile"} className={location.pathname === '/profile' && 'selected'}>Profile</Link>
              <Link to={"/profile/edit"} className={location.pathname === '/profile/edit' && 'selected'}>Edit Profile</Link>
              <Link to={"/profile/changepassword"} className={location.pathname === '/profile/changepassword' && 'selected'}>Change Password</Link>
            </div>
        </aside>
        <Outlet />
    </div>
  )
}

export default Profile