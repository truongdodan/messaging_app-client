import React from 'react'
import './Layout.css'
import {Link, Outlet, useLocation} from 'react-router-dom'
import {Globe, MessageCircle, Users, CircleUser, LogOut} from 'lucide-react'

const Layout = () => {
  // get location for the current tab display
  const location = useLocation();

  return (
    <div className='main-container'>
      <main>
        <Outlet />
      </main>
      <nav>
          <Link to="/global" className={location.pathname === '/global' && 'selected'}>
            <div className="icon-container global-icon">
              <Globe />
            </div>
            <p className='nav__title'>Global</p>
          </Link>
          <Link to="/chats" className={location.pathname === '/chats' && 'selected'}>
            <div className="icon-container chat-icon">
              <MessageCircle />
            </div>
            <p className='nav__title'>Chats</p>
          </Link>
          <Link to="groups" className={location.pathname === '/groups' && 'selected'}>
            <div className="icon-container group-icon">
              <Users /> 
            </div>
            <p className='nav__title'>Groups</p>
          </Link>
          <div className="space" ></div>
          <Link to="/profile" className={location.pathname === '/profile' && 'selected'}>
            <div className="icon-container profile-icon">
              <CircleUser /> 
            </div>
            <p className='nav__title'>Profile</p>
          </Link>
          <Link to="" >
            <div className="icon-container logout-icon">
              <LogOut /> 
            </div>
            <p className='nav__title'>Logout</p>
          </Link>
      </nav>
    </div>
  )
}

export default Layout;