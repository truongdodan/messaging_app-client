import { useState } from 'react'
import './Groups.css'
import ConversationList from '../../components/ConversationList/ConversationList'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import useMessaging from '../../hook/useMessaging'


const Groups = () => {
  const {getConversationsByType, conversationsLoading} = useMessaging();

  const location = useLocation();
  const navigate = useNavigate();
  const [closable, setClosable] = useState(false);
  const newGroupOpen = location.pathname === "/groups/new";

  return (
    <div className={`groups ${newGroupOpen && 'new-group--open'}`}>
        <ConversationList 
          conversations={getConversationsByType("GROUP")} 
          loading={conversationsLoading}
          closable={closable} 
          onNewIconClick={() => {
            navigate("/groups/new");
            setClosable(true);
          }}
          onCloseIconClick={() => {
            navigate("/groups");
            setClosable(false);
          }}
        />
        <Outlet />
    </div>
  )
}

export default Groups