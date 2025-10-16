import { useEffect } from 'react'
import './Global.css'
import UserList from '../../components/UserList/UserList'
import Chat from '../../components/Chat/Chat'
import useMessaging from '../../hook/useMessaging'

const Global = () => {
  const {conversationsLoading, loadConversationMessages, getGlobalConversation} = useMessaging();

    useEffect(() => {
        if (conversationsLoading) return;

        const globalConversation = getGlobalConversation();

        if (globalConversation) {
          loadConversationMessages(globalConversation.id);
        }

    }, [conversationsLoading, getGlobalConversation, loadConversationMessages]);

  return (
    <div className='global'>
      <UserList />
      <Chat/>
    </div>
  )
}

export default Global