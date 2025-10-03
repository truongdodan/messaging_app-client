import React, { useEffect, useState } from 'react'
import './Chats.css'
import ConversationList from '../../components/ConversationList/ConversationList'
import Chat from '../../components/Chat/Chat'
import axiosInstance from '../../service/axios'
import useConversation from '../../hook/useConversation'
import { Outlet, useLocation } from 'react-router-dom'
import UserList from '../../components/UserList/UserList'

const Chats = () => {
  const { conversationItems, conversationItemsLoading } = useConversation();
  const [findUserTabOpen, setFindUserTabOpen] = useState(false);

  return (
    <div className='chats'>
        {
          findUserTabOpen
          ? <UserList onCloseIconClick={() => {setFindUserTabOpen(false)}}/>
          : <ConversationList  
              loading={conversationItemsLoading} 
              conversations={conversationItems?.filter(conversationItem => conversationItem?.type === "DIRECT")} 
              onNewIconClick={() => {setFindUserTabOpen(true)}}
            />
        }
        <Outlet />
    </div>
  )
}

export default Chats 