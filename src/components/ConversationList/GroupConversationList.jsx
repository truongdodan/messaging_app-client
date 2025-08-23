import React from 'react'
import Conversation from '../../components/Conversation/Conversation';
import './ConversationList.css'
import { Plus } from 'lucide-react';

const groupConversation = {
    id: 111,
    type: "GROUP", 
    title: "average dark souls 3 enjoyer", 
    participant: [{}, {}, {}],
    isActive: false,
}

const groupConversation2 = {
    id: 6969,
    type: "GROUP", 
    title: "top night reign player", 
    participant: [{}, {}, {}],
    isActive: true,
}

const GroupConversationList = () => {
  return (
    <div className='conversation-list'>
        <header className='conversation-list__header'>
            <div className="conversation-list__title">Groups</div>
            <div className="icon-container new-conversation">
                <Plus />
            </div>
        </header>
        <div className='conversation-list__body'>
            <Conversation conversation={groupConversation}/>
            <Conversation conversation={groupConversation2}/>
        </div>
    </div>
  )
}

export default GroupConversationList;