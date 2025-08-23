import React from 'react'
import './NewGroup.css'
import { ArrowLeftIcon, Camera, Pen } from 'lucide-react'
import Button from '../Button/Button'
import { User } from '../UserList/UserList'

const user = {
    username: "dantRuongdo", 
    firstname: "Truong", 
    lastname: "Do Dan",
    isActive: true
}

const user2 = {
    username: "thangTa", 
    firstname: "Thang", 
    lastname: "Tadanh",
    isActive: true
}

const user3 = {
    username: "namhoaido", 
    firstname: "nam", 
    lastname: "Do Hoai",
    isActive: false
}

const NewGroup = () => {
  return (
    <div className="new-group">
      <div className="new-group__header">
        <div className="icon-container go-back">
            <ArrowLeftIcon />
        </div>
        <div className="title new-group__title">Create Group</div>
      </div>
      <hr />
      <form className="new-group__form">
        <div className="new-group__profile">
          <div className="new-group_subtitle">
            <div>Group Profile</div>
            <Button icon={Pen} text={'Change'}/>
          </div>
          <div className="new-group__profile-preview">
            <img src="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse1.explicit.bing.net%2Fth%2Fid%2FOIP.P77h9IXLQi-ya-zxlfzt8QHaGy%3Fcb%3Dthfvnext%26pid%3DApi&sp=1754615392T0db4f5b5436aa0c9ab81b40af1173135b92c2ed14b2b619236033891df2849d1" alt="Profile image" />
            {/* <Camera /> */}
          </div>
        </div>
        <hr />
        <div className="new-group__group-name">
          <label htmlFor="groupName">Group Name:</label>
          <input type="text" name='groupName' id='groupName' className='input'/>
        </div>
        <div className="new-group__select-member">
          <label htmlFor="selectMember">Select Members:</label>
          <input type="text" name='selectMember' id='selectMember' className='input'/>
          <div className="new-group__searched-member">
            <User user={user}/>
            <User user={user}/>
          </div>
        </div>
        <div className="new-group__member-list">
          <User user={user}/>
          <User user={user2}/>
          <User user={user3}/>
        </div>
        <Button text={'Create Group'}/>
      </form>
    </div>
  )
}

export default NewGroup