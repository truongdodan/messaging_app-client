import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ConversationProvider } from './context/ConversationProvider.jsx'
import { ChatProvider } from './context/ChatProvider.jsx'
import { SocketProvider } from './context/SocketProvider.jsx'
import {Toaster} from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <ConversationProvider>
          <ChatProvider>
            <Toaster
              position='bottom-right'
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'white',  // Your custom background color
                  color: 'black',          // Your custom text color
                  padding: '0.5rem 1rem',        // Your custom padding
                  borderRadius: '8px',
                }, 
                success: {
                  duration: 3000,
                  style: {
                    background: "#10b981",
                    color: '#fff',
                  },
                  iconTheme: {
                    primary: '#fff',      // White icon
                    secondary: '#10b981', // Green circle behind icon
                  },
                },
                error: {
                  duration: 4000,
                  style: {
                    background: '#ef4444',  // Red background
                    color: '#fff',
                  },
                  iconTheme: {
                    primary: '#fff',      // White X icon
                    secondary: '#ef4444', // Red circle behind icon
                  },
                },
              }}  
            >
            </Toaster>
            <App />
          </ChatProvider>
        </ConversationProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
)
