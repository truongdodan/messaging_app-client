import { useState } from 'react'
import './Chats.css'
import ConversationList from '../../components/ConversationList/ConversationList'
import { Outlet } from 'react-router-dom'
import UserList from '../../components/UserList/UserList'
import useMessaging from '../../hook/useMessaging'

const Chats = () => {
  const {getConversationsByType, conversationsLoading} = useMessaging();
  const [findUserTabOpen, setFindUserTabOpen] = useState(false);

  return (
    <div className='chats'>
        {
          findUserTabOpen
          ? <UserList onCloseIconClick={() => {setFindUserTabOpen(false)}}/>
          : <ConversationList  
              loading={conversationsLoading} 
              conversations={getConversationsByType("DIRECT")} 
              onNewIconClick={() => {setFindUserTabOpen(true)}}
            />
        }
        <Outlet />
    </div>
  )
}

export default Chats 