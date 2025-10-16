import React from 'react'
import './Conversation.css'
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hook/useAuth';

// type = 'DIRECT' display user fullname and username
// type = 'GROUP' display conversation title
const Conversation = ({conversation, isOnline}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {auth} = useAuth();
  const isChats = location.pathname.startsWith("/chats");
  const expectedPath = isChats
    ? `/chats/${conversation?.id}`
    : `/groups/${conversation?.id}`;
  const isSelected = location.pathname === expectedPath;
  const recipient = conversation?.participants?.find  (par => par?.user?.id !== auth?.user?.id);
  

  const openConversation = () => {
    if (isChats) {
      navigate(`/chats/${conversation?.id}`);
    } else {
      navigate(`/groups/${conversation?.id}`);
    }
  }

  return (
    <div className={isSelected ? 'conversation-item selected' : 'conversation-item'} onClick={openConversation}>
        <div className="profile-wrapper">
          <img src={conversation?.profileUrl || "user.png"} alt="nahhh" />
          <div className={isOnline ? 'active-indicator online' : 'active-indicator offline'}></div>
        </div>
        {conversation?.type === "DIRECT" && conversation?.participants?.length > 0 && 
          <div className='conversation-item__title'>
            <p className='fullname'>{conversation.title}</p>
            <p className='username'>{'@' + recipient?.user?.username}</p>
          </div>
        }
        {conversation?.type === "GROUP" && <div className='conversation-item__title'>
                                            {conversation.title}
                                          </div>
        }
    </div>
  )
}

export default Conversation;