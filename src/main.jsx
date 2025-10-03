import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ConversationProvider } from './context/ConversationProvider.jsx'
import { ChatProvider } from './context/ChatProvider.jsx'
import { SocketProvider } from './context/SocketProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <ConversationProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </ConversationProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
)
