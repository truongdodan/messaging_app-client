import React, { useEffect, useRef, useState } from 'react'
import './UserList.css'
import axiosInstance from '../../service/axios'
import useAuth from '../../hook/useAuth'
import SidebarHeader from '../SidebarHeader/SidebarHeader'
import { useNavigate } from 'react-router-dom'
import useSocket from '../../hook/useSocket'

const User = ({user, onClick, isOnline}) => {
    const navigate = useNavigate();

    const userProfileNavigate = () => {
        navigate(`/profile/${user.id}`);
    }

    return (
        <div className='user-item' onClick={onClick ? onClick : userProfileNavigate}>
            <div className="profile-wrapper">
            <img src={user?.profileUrl ? user.profileUrl : "/user.png"} alt="" />
            <div className={isOnline ? 'active-indicator online' : 'active-indicator offline'}></div>
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

    const {onlineUsers} = useSocket();

    // get image url here

    // Get all users
    useEffect(() => {
        if (!auth?.accessToken) return;

        const getUser = async () => {
            try {
                const res = await axiosInstance.get('/users');
                const users = res?.data || [];
                setUsers(users);

            } catch (error) {
                console.error("Error when trying to get users: ", error);
            }
        }

        getUser();
        
    }, [auth?.accessToken]);

    const searchUsers = async (search) => {
        try {
            if (!search.trim()) { // if search is empty get all
                const res = await axiosInstance.get('/users');
                const users = res?.data || [];
                setUsers(users);
            } else {
                const res = await axiosInstance.get(`/users?search_query=${search}`);
                const users = res?.data || [];
                setUsers(users);
            }
        } catch (error) {
            console.error("Error when searching for users: ", error);
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
            {users && users?.map(user => (user?.id !== auth?.user?.id) && <User key={user?.id} user={user} isOnline={onlineUsers.has(user.id)}/>)}
        </div>
    </div>
  )
}

export default UserList