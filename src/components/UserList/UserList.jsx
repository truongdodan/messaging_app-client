import React from 'react'
import './UserList.css'
import { X } from 'lucide-react'

const user = {
    username: "dantRuongdo", 
    firstname: "Truong", 
    lastname: "Do Dan",
    isActive: true
}

const user2 = {
    username: "thangTa", 
    firstname: "Thang", 
    lastname: "Tadanh",
    isActive: true
}

const user3 = {
    username: "namhoaido", 
    firstname: "nam", 
    lastname: "Do Hoai",
    isActive: false
}

const User = ({user}) => {
    return (
        <div className='user-item'>
            <div className="profile-wrapper">
            {user?.profileUrl
            ? <img src={conversation.profileUrl} alt="nahhh" />
            : <img src="/user.png" alt="nahhh2" />
            }
            <div className={user?.isActive ? 'active-indicator online' : 'active-indicator offline'}></div>
            </div>
            <div className='user-item__title'>
                <p className='fullname'>{user.lastname + ' ' + user.firstname}</p>
                <p className='username'>{'@' + user.username}</p>
            </div>
        </div>
    );
}

export {User};

const UserList = () => {
  return (
    <div className='search-user'>
        <header className='search-user__header'>
            <div className="sidebar-title">Search Users</div>
            <div className="icon-container close-search-user icon">
                <X />
            </div>
        </header>
        <form className='form--search-user'>
            <input type="text" id='searchUser' name='searchUser' className='input'/>
        </form>
        <div className="user-list">
            <User user={user}/>
            <User user={user2}/>
            <User user={user3}/>
        </div>
    </div>
  )
}

export default UserList