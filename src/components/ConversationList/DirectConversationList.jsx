import React from 'react'
import Conversation from '../../components/Conversation/Conversation';
import './ConversationList.css'
import { Plus } from 'lucide-react';

const directConversation = {
    id: 111,
    type: "DIRECT", 
    title: "dark souls enjoyer", 
    participant: {
        username: "hoa", 
        firstname: "tRan", 
        lastname: "Thu hoa"
    },
    isActive: false,
}

const directConversation2 = {
    id: 6969,
    type: "DIRECT", 
    title: "", 
    participant: {
        username: "dantRuongdo", 
        firstname: "Truong", 
        lastname: "Do Dan"
    },
    isActive: true,
}

const groupConversation = {
    id: 6969,
    type: "GROUP", 
    title: "dark soul enjoyer", 
    participant: {
        username: "dantRuongdo", 
        firstname: "Truong", 
        lastname: "Do Dan"
    },
    isActive: true,
}

const groupConversation2 = {
    id: 6969,
    type: "GROUP", 
    title: "3 wolfs", 
    participant: {
        username: "dantRuongdo", 
        firstname: "Truong", 
        lastname: "Do Dan"
    },
    isActive: true,
}

const groupConversation3 = {
    id: 6969,
    type: "GROUP", 
    title: "sawa the kham", 
    participant: {
        username: "dantRuongdo", 
        firstname: "Truong", 
        lastname: "Do Dan"
    },
    isActive: true,
}

const DirectConversationList = () => {
  return (
    <div className='conversation-list'>
        <div className='conversation-list__header'>
            <div className="sidebar-title">Chats</div>
            <div className="icon-container new-conversation">
                <Plus />
            </div>
        </div>
        <div className='conversation-list__body'>
            {/* <Conversation conversation={groupConversation}/>
            <Conversation conversation={groupConversation2}/>
            <Conversation conversation={groupConversation3}/> */}
            <Conversation conversation={directConversation}/>
            <Conversation conversation={directConversation2}/>
        </div>
    </div>
  )
}

export default DirectConversationList;