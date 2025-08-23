import React from 'react'
import './Chats.css'
import DirectConversationList from '../../components/ConversationList/DirectConversationList'
import Chat from '../../components/Chat/Chat'

const Chats = () => {
  return (
    <div className='chats'>
        <DirectConversationList />
        <Chat />
    </div>
  )
}

export default Chats 