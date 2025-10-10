import React from 'react'
import './Skeleton.css'

export const Spinner = ({size='small'}) => {
    return <div className={`spinner spinner--${size}`}></div>;
}

export const Skeleton = ({width = '100%', height = '2.5rem', borderRadius='8px'}) => {
  return (
    <div
        className='skeleton'
        style={{width, height, borderRadius}}
    ></div>
  )
}

export const ConversationSkeleton = () => {
  return (
    <div className="conversation-skeleton">
        <Skeleton />
    </div>
  );
}

export const UserSkeleton = () => {
  return (
    <div className={`conversation conversation--direct`}>
        <div className="conversation__body">
            <div className='conversation__header'>
                <div className="skeleton skeleton--circle"></div>
                <Skeleton width='20%' height='2rem' borderRadius='1rem'/>
            </div>
            <hr />
            <div className="conversation__messages">
                <MessageSkeleton width='15%'/>
                <MessageSkeleton />
                <MessageSkeleton fromSelf={true} width='10%'/>
                <MessageSkeleton fromSelf={true}/>
                <MessageSkeleton />
                <MessageSkeleton width='50%'/>
                <MessageSkeleton width='20%' fromSelf={true}/>
                <MessageSkeleton width='30%'/>
                <MessageSkeleton width='40%'/>
            </div> 
            <hr />
            <form className="conversation__form">
              <Skeleton borderRadius='1rem' height='3rem'/>
                <div className="skeleton skeleton--circle"></div>
                <div className="skeleton skeleton--circle"></div>
            </form>
        </div>
    </div>  
  );
}

export const MessageSkeleton = ({width='30%', height='2.5rem', fromSelf}) => {
  return (
    <div className={`message-skeleton ${fromSelf ? 'from-self' : ''}`}>
      <div className="skeleton skeleton--circle"></div>
      <Skeleton width={width} height={height} borderRadius='1rem'/>
    </div>
  );
}

/* export const ImageSkeleton = () => {
  return (
    <div className={`conversation conversation--direct`}>
        <Skeleton />
    </div>  
  );
}
 */
