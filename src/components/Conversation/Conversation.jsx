import React from 'react'
import './Conversation.css'

// type = 'DIRECT' display user fullname and username
// type = 'GROUP' display conversation title
const Conversation = ({conversation}) => {
  const isSelected = false;

  return (
    <div className={isSelected ? 'conversation-item selected' : 'conversation-item'}>
        <div className="profile-wrapper">
          {conversation?.profileUrl 
          ? <img src={conversation.profileUrl} alt="nahhh" />
          : <img src="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.qNfoguQF-UXY1F1MdXDXrAHaHY%3Fr%3D0%26pid%3DApi&sp=1754728267T4c820c6395da181f8d757c444fd7934b934a0a309ad5066b61654c18be5ea922" alt="nahhh2" />
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