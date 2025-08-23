import Message from "./Message"

export default {
    title: 'Component - Message',
    component: Message,
}

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
    content: 'Hello there',
    sender: user2
}

const message3 = {
    type: 'TEXT',
    content: 'Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there Hello there ',
    sender: user2
}

const imgMessage = {
    type: 'IMAGE',
    content: '/user.png',
    sender: loginUser
}

const imgMessage2 = {
    type: 'IMAGE',
    content: '/user.png',
    sender: user2
}

export const MyMessage = () => <Message message={message} isSender={message.sender.username === username}/>
export const DirectMessage = () => <Message message={message2} isSender={message2.sender.username === username}/>
export const GroupMessage = () => <div className="conversation--group">
    <Message message={message3} isSender={message3.sender.username === username}/>
</div>
export const ImgMsg = () => <Message message={imgMessage} isSender={imgMessage.sender.username === username}/>
export const ImgMsg2 = () => <Message message={imgMessage2} isSender={imgMessage2.sender.username === username}/>
