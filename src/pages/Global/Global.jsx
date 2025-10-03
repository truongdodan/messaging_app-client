import React, { useEffect } from 'react'
import './Global.css'
import UserList from '../../components/UserList/UserList'
import Chat from '../../components/Chat/Chat'
import { useLocation } from 'react-router-dom'
import axiosInstance from '../../service/axios'
import useChat from '../../hook/useChat'

const Global = () => {
  const location = useLocation();
  const {chats, setChats, setChatLoading} = useChat();
    useEffect(() => {
        // if the GLOBAL conversation is not retrive yet, retrive it
       if (chats?.find(chat => chat.type === "GLOBAL")) {
        axiosInstance.get("/conversations?type=GLOBAL")
            .then(res => {
              setChats(pre => [
                ...(pre || []),
                ...res.data
              ]);
            })
            .catch(err => {
              console.error(err);
            })
       }
    }, []);

  return (
    <div className='global'>
      <UserList />
      <Chat globalChatIndex={chats?.findIndex(chat => chat.type === "GLOBAL")}/>
    </div>
  )
}

export default Global