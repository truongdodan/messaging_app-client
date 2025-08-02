import React from 'react'
import './Conversation.css'

// type = 'DIRECT' display user fullname and username
// type = 'GROUP' display conversation title
const Conversation = ({conversation}) => {
  const isSelected = false;

  return (
    <div className={isSelected ? 'conversation-item conversation-selected' : 'conversation-item'}>
        <div className="profile-wrapper">
          {conversation?.profileUrl
          ? <img src={conversation.profileUrl} alt="nahhh" />
          : <img src="/user.png" alt="nahhh2" />
          }
          <div className={conversation?.isActive ? 'active-indicator online' : 'active-indicator offline'}></div>
        </div>
        {conversation?.type === "DIRECT" && <div className='conversation-item__title'>
                                              <p className='fullname'>{conversation.participant.lastname + ' ' + conversation.participant.firstname}</p>
                                              <p className='username'>{'@' + conversation.participant.username}</p>
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