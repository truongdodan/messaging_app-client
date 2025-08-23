import React from 'react'
import './Groups.css'
import DirectConversationList from '../../components/ConversationList/DirectConversationList'
import Chat from '../../components/Chat/Chat'

const Groups = () => {
  return (
    <div className='groups'>
        <DirectConversationList />
        <Chat />
    </div>
  )
}

export default Groups