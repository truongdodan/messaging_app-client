import React, { useEffect } from 'react'
import Conversation from '../Conversation/Conversation';
import './ConversationList.css'
import { Plus } from 'lucide-react';
import {useLocation} from 'react-router-dom'
import SidebarHeader from '../SidebarHeader/SidebarHeader';
import useConversation from '../../hook/useConversation'

// get list of conversation for data
// get function to determine what the new icon do - find user or create new group chat
const ConversationList = ({loading, conversations, closable=false, onNewIconClick, onCloseIconClick}) => {
    const location = useLocation(); 

    if(loading) return <div>Conversation Loading...</div>

  return (
    <div className='conversation-list'>
        <SidebarHeader 
        title={location.pathname.startsWith('/chats') ? 'Chats' : 'Groups'} 
        closable={closable} 
        onNewIconClick={onNewIconClick} 
        onCloseIconClick={onCloseIconClick}/> 
        <div className='conversation-list__body'>
            {conversations && conversations.map(conver => <Conversation key={conver?.id} conversation={conver}/>)}
        </div>
    </div>
  )
}

export default ConversationList;