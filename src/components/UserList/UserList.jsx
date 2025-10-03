import React, { useEffect, useRef, useState } from 'react'
import './UserList.css'
import { X } from 'lucide-react'
import axiosInstance from '../../service/axios'
import useAuth from '../../hook/useAuth'
import SidebarHeader from '../SidebarHeader/SidebarHeader'
import { useNavigate } from 'react-router-dom'

const User = ({user, onClick}) => {
    const navigate = useNavigate();

    const userProfileNavigate = () => {
        navigate(`/profile/${user.id}`);
    }

    return (
        <div className='user-item' onClick={onClick ? onClick : userProfileNavigate}>
            <div className="profile-wrapper">
            <img src={user?.profileUrl ? user.profileUrl : "/user.png"} alt="" />
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

const UserList = ({onCloseIconClick}) => {
    const {auth} = useAuth();
    const [users, setUsers] = useState([]);
    const [searchedValue, setSearchedValue] = useState("");
    const timeoutRef = useRef(null); // store timeout ref

    // Get all users
    useEffect(() => {
        if (!auth?.accessToken) return;
        
        axiosInstance.get("/users")
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.error(err);
            })
    }, [auth?.accessToken]);

    const searchUsers = (search) => {
        if (!search.trim()) { // if search is empty get all
            axiosInstance.get("/users")
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.error(err);
            })
        } else {
            axiosInstance.get(`/users?search_query=${search}`)
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.error(err);
            })
        }
    }

    const handleOnchange = (e) => {
        const newSearchedValue = e.target.value;
        setSearchedValue(newSearchedValue);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            searchUsers(newSearchedValue);
        }, 750)

    };

  return (
    <div className='search-user'>
        <SidebarHeader 
        title={"Search User"} 
        closable={true}
        onCloseIconClick={onCloseIconClick} 
        />
        <form className='form--search-user'>
            <input 
            type="text" 
            id='searchUser' 
            name='searchUser' 
            className='input' 
            value={searchedValue}
            onChange={handleOnchange}/>
        </form>
        <div className="user-list">
            {users && users.map(user => (user?.id !== auth?.user?.id) && <User key={user?.id} user={user} />)}
        </div>
    </div>
  )
}

export default UserList