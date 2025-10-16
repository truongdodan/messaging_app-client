import Conversation from '../Conversation/Conversation';
import './ConversationList.css'
import {useLocation} from 'react-router-dom'
import SidebarHeader from '../SidebarHeader/SidebarHeader';
import useSocket from '../../hook/useSocket';
import { ConversationSkeleton } from '../Sekeleton/Skeleton';


// get list of conversation for data
// get function to determine what the new icon do - find user or create new group chat
const ConversationList = ({loading, conversations, closable=false, onNewIconClick, onCloseIconClick}) => {
    const location = useLocation(); 
    const {onlineUsers} = useSocket();

  return (
    <div className='conversation-list'>
        <SidebarHeader 
        title={location.pathname.startsWith('/chats') ? 'Chats' : 'Groups'} 
        closable={closable} 
        onNewIconClick={onNewIconClick} 
        onCloseIconClick={onCloseIconClick}/> 
        <div className='conversation-list__body'>
            {
              loading
              ? <>
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                </>
              : conversations && conversations.map(conver => <Conversation 
                                                            key={conver?.id} 
                                                            conversation={conver} 
                                                            isOnline={
                                                              conver.type === 'DIRECT' 
                                                                  ? onlineUsers.has(conver?.participants?.[0].user?.id)
                                                                  : false  // Don't show online status for groups
                                                            }
                                                          />
                )
            }
        </div>
    </div>
  )
}

export default ConversationList;