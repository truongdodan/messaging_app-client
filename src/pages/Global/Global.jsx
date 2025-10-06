import React, { useEffect } from 'react'
import './Global.css'
import UserList from '../../components/UserList/UserList'
import Chat from '../../components/Chat/Chat'
import { useLocation } from 'react-router-dom'
import axiosInstance from '../../service/axios'
import { useState } from 'react'

const Global = () => {
  const location = useLocation();
  const [globalChatIndex, setGlobalChatIndex] = useState(null);

    useEffect(() => {
        if (globalChatIndex) return;

        const getGlobalChat = async () => {
          const globalChat = await axiosInstance.get("/global");

          setGlobalChatIndex(globalChat.data.globalConversationId);
        }

        getGlobalChat();

    }, [globalChatIndex]);

  return (
    <div className='global'>
      <UserList />
      <Chat globalChatIndex={globalChatIndex} type={"GLOBAL"}/>
    </div>
  )
}

export default Global