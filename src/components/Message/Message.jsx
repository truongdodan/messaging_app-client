import React from 'react'
import PropTypes from 'prop-types'
import './Message.css'
import {EllipsisVertical} from 'lucide-react'

// handle content type when rendering
const MessageContent = ({type, content}) => {
  return (
    <>
      {type === 'TEXT' && <div className='message--text'>{content}</div>}
      {type === 'IMAGE' && <div className='message--image image-wrapper'>
                            <img src={content} alt='Fail to load image'/>
                           </div>
      }
    </>
  )
}

// 'type' text, img.
// 'content' text content or image url.
// 'label' indicate who the message coming from (SELF, OTHER)
const Message = ({message, isSender}) => {
  return (
    <>
      { 
        isSender 
          ? <div className='message message--self'> 
                <div className="icon-container icon message-options">
                  <EllipsisVertical size={16}/>
                </div>
                <MessageContent type={message?.type} content={message?.content}/>
            </div>
          : <div className='message message--other'> 
              <div className="message__grid-wrapper">
                <div className='message__username'>{'@' + message?.sender?.username}</div>
                <div className='message__content'>
                  <MessageContent type={message?.type} content={message?.content}/> 
                </div> 
                <div className='message__profile'>
                  <img src={message?.sender?.profileUrl} alt="" />
                </div>
              </div>
            </div> 
      }
    </>
  )
}


export default Message;