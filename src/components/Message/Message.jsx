import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './Message.css'
import {EllipsisVertical} from 'lucide-react'
import axiosInstance from '../../service/axios'

// handle content type when rendering
const MessageContent = ({type, content}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState("");
  const [fileDetails, setFileDetails] = useState({});
  let message;

  useEffect(() => {
    if (type === "FILE") {
      const details = JSON.parse(content)
      setFileDetails(details);
      setIsLoading(true);

      // use this if have separate route for downloading file
      /* // fetch url for image
      if (details?.mimetype?.startsWith("image/")) {
        axiosInstance.get(`/messages/file/sign-url?path=${fileDetails.path}`)
          .then(res => {
            setSignedUrl(res?.data?.signedUrl);
          })
          .catch(err => console.error("Failed getting image url: ", err))
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      } */

      axiosInstance.get(`/messages/file/sign-url?path=${details.path}`)
          .then(res => {
            setSignedUrl(res?.data?.signedUrl);
          })
          .catch(err => console.error("Failed getting image url: ", err))
          .finally(() => setIsLoading(false));

    }
  }, [type, content]);

  if (type === "TEXT") {
    message = <div className='message--text'>{content}</div>;
  } else if (type === "FILE" && fileDetails) {
    if (isLoading) return <div>File loading...</div>
    else if (fileDetails?.mimetype?.startsWith("image/")) {
      message = (
        <div className='message--image image-wrapper'>
            {
              signedUrl
              ? <img src={signedUrl || '#'} alt={fileDetails?.filename}/>
              : <div style={{color: "red"}}>Fail to load image</div>
            }
        </div>
      );
    } else {
      message = <div className='message--file file-wrapper message--text'>
                  <a href={signedUrl} target="_blank" rel="noopener noreferrer">
                    {fileDetails?.filename}
                  </a>
                </div>;
    }
  }

  return <>{message}</>
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
                  <img src={message?.sender?.profileUrl ? message?.sender?.profileUrl : "/user.png"} alt="" />
                </div>
              </div>
            </div> 
      }
    </>
  )
}


export default Message;