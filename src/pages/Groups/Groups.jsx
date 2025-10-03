import React, { useEffect, useState } from 'react'
import './Groups.css'
import ConversationList from '../../components/ConversationList/ConversationList'
import Chat from '../../components/Chat/Chat'
import useConversation from '../../hook/useConversation'
import axiosInstance from '../../service/axios'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const Groups = () => {
  const {conversationItems, conversationItemsLoading} = useConversation();

  const location = useLocation();
  const navigate = useNavigate();
  const [closable, setClosable] = useState(false);
  const newGroupOpen = location.pathname === "/groups/new";

  return (
    <div className={`groups ${newGroupOpen && 'new-group--open'}`}>
        <ConversationList 
          conversations={conversationItems?.filter(conversationItem => conversationItem?.type === "GROUP")} 
          loading={conversationItemsLoading}
          closable={closable} 
          onNewIconClick={() => {
            navigate("/groups/new");
            setClosable(true);
          }}
          onCloseIconClick={() => {
            navigate("/groups");
            setClosable(false);
          }}
        />
        <Outlet />
    </div>
  )
}

export default Groups