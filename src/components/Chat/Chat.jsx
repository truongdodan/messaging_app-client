import React from 'react'
import './Chat.css'
import { ArrowLeftIcon, Image, SendHorizonal } from 'lucide-react'
import Message from '../Message/Message'

const username = 'dantRuongdo'

const loginUser = {
    username: 'dantRuongdo',
    profileUrl: 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.sq-yW94k7dITMMs_QLwk6gAAAA%3Fr%3D0%26pid%3DApi&sp=1754063045T4668ba1099c673e1adcc028013ac0839633b01c3f710f290940631bc86f4d7c4'
};

const user2 = {
    username: 'ungabunga',
    profileUrl: 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.A1PnKjFqsQtf_BnlCmkw4gHaEK%3Fr%3D0%26pid%3DApi&sp=1754095639T0bd7a8db02b87216c1946da2ec44f5e956702bdc67022e76a1a94feeceb51e8d'
}

const message = {
    type: 'TEXT',
    content: 'Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there ',
    sender: loginUser
}

const message2 = {
    type: 'TEXT',
    content: 'Hello?',
    sender: loginUser
}

const message3 = {
    type: 'TEXT',
    content: 'Can you effing hear me?',
    sender: loginUser
}

const message4 = {
    type: 'IMAGE',
    content: '/user.png',
    sender: user2
}

const message5 = {
    type: 'IMAGE',
    content: '/user.png',
    sender: user2
}

const Chat = () => {
  return (
    <div className='conversation conversation--direct'>
        <div className="conversation__body">
            <div className='conversation__header'>
                <div className="icon-container go-back">
                    <ArrowLeftIcon />
                </div>
                <div className="profile-container">
                    <img src="" alt="" />
                </div>
                <div className="title conversation__title">Global</div>
            </div>
            <hr />
            <div className="conversation__messages">
                <Message message={message} isSender={message.sender.username === username}/>
                <Message message={message2} isSender={message2.sender.username === username}/>
                <Message message={message3} isSender={message3.sender.username === username}/>
                <div className="time">08/08/2025</div>
                <Message message={message4} isSender={message4.sender.username === username}/>
                <Message message={message5} isSender={message5.sender.username === username}/>
            </div> 
            <hr />
            <form className="conversation__form">
                {/* <input type="text" className='input'/> */}
                <textarea className='input'/>
                <div className="icon-container image">
                    <Image />
                </div>
                <div className="icon-container send-message">
                    <SendHorizonal />
                </div>
            </form>
        </div>
    </div>
  )
}

export default Chat