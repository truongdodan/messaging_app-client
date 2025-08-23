import React from 'react'
import './Global.css'
import UserList from '../../components/UserList/UserList'
import Chat from '../../components/Chat/Chat'

const Global = () => {
  return (
    <div className='global'>
      <UserList />
      <Chat />
    </div>
  )
}

export default Global