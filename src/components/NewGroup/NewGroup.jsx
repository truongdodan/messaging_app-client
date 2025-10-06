import React, { useEffect, useRef, useState } from 'react'
import './NewGroup.css'
import { ArrowLeftIcon, Camera, Pen } from 'lucide-react'
import Button from '../Button/Button'
import { User } from '../UserList/UserList'
import GoBackBtn from '../GoBackBtn/GoBackBtn'
import axiosInstance from '../../service/axios'
import useConversation from '../../hook/useConversation'
import { useNavigate } from 'react-router-dom'

const NewGroup = () => {
  const {createConversation, conversationItems} = useConversation();
  const navigate = useNavigate();

  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [newConversation, setNewConversation] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupMemberList, setGroupMemberList] = useState([]); 
  const fileInputRef = useRef();
  const [error, setError] = useState("");

  const [users, setUsers] = useState([]);
  const [searchedValue, setSearchedValue] = useState("");
  const timeoutRef = useRef(null); // store timeout ref

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // validate file type
    if (!file.type.startsWith('image/')) {
      // inform wrong file type
      console.error("Only accept image file");
      return;
    }

    // validate file size (max: 5mb)
    if (file.size > 5 * 1024 * 1024) {
      console.error("Image should be less than 5MB");
      return;
    }

    // create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    }
    reader.readAsDataURL(file);
  }

  const handleChangeClick = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const membersIds = groupMemberList?.map(member => member?.id);
    const file = fileInputRef?.current?.files[0];

    if (!file) {
      setError("Please choose group image");
      return;
    }

    // no member check
    if (membersIds?.length <= 0) {
      setError("No friend?");
      return;
    }

    try {
            // upload group image to cloud
            const formData = new FormData();
            formData.append("file", file);
            
            const res = await axiosInstance.post('/messages/file', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            const { path } = res.data;
        
            // create new group/conversation
            setIsCreatingConversation(true);

            const handleNewConversation = (res) => {
              if (res.error) {
                console.error("Fail to create conversation: ", res.error);
              }

              console.log("New group conver created");
              setNewConversation(res);
              setIsCreatingConversation(false);
            }
            
            createConversation({
                type: "GROUP",
                title: groupName,
                profileUrl: path,
                allMemberIds: membersIds,
            }, handleNewConversation);

    } catch (error) {
        console.error('File upload failed:', error);
        // Handle error (e.g., show toast)
    }
  }

  // listen for new group/conversation created
  useEffect(() => {
    if (!isCreatingConversation && !newConversation?.id) return;

    navigate(`/groups/${newConversation?.id}`);

  }, [conversationItems, isCreatingConversation, newConversation?.id]);

  const searchUsers = (search) => {
        if (!search.trim()) { // if search is empty get all
            axiosInstance.get("/users")
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.error("Error when searching user: ", err);
            })
        } else {
            axiosInstance.get(`/users?search_query=${search}`)
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.error("Error when searching user: ", err);
            })
        }
  }

  const handleOnchange = (e) => {
      const newSearchedValue = e.target.value;
      setSearchedValue(newSearchedValue);

      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
          searchUsers(newSearchedValue);
      }, 750)

  };

  const handleAddMember = (user) => {
    setGroupMemberList(pre =>  {
      if (pre.some(u => u.id === user.id)) return pre;
      return [...(pre || []), user ];
    });

    setUsers([]);
    setSearchedValue("");
  }

  const handleRemoveMember = (user) => {
    setGroupMemberList(pre => pre.filter(u => u.id !== user.id));
  }

  return (
    <div className="new-group">
      <div className="new-group__header">
        <GoBackBtn />
        <div className="title new-group__title">Create Group</div>
      </div>
      <hr />
      <form className="new-group__form" onSubmit={handleSubmit}>
        <div className="new-group__profile">
          <div className="new-group_subtitle">
            <div>Group Profile</div>
            <Button 
              icon={Pen} 
              text={'Change'}
              onClick={handleChangeClick}
            />
          </div>
          <div className="new-group__profile-preview">
            <img src={previewImage ? previewImage : "/user.png"} alt="Profile image" />
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <hr />
        <div className="new-group__group-name">
          <label htmlFor="groupName">Group Name:</label>
          <input 
            type="text" 
            name='groupName' 
            id='groupName' 
            className='input'
            value={groupName}
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
            required
          />
        </div>
        <div className="new-group__select-member">
          <label htmlFor="selectMember">Select Members:</label>
          <input 
            type="text" 
            name='selectMember' 
            id='selectMember' 
            className='input'
            value={searchedValue}
            onChange={handleOnchange}
            onFocus={handleOnchange}
            onBlur={(e) => {
              // delay 200ms so onclick can fire
              setTimeout(() =>{
                setUsers([]);
              }, 200)
            }}
          />
          <div className="new-group__searched-member">
              {
                users && users.map( user => 
                  <User 
                    key={user?.id} 
                    user={user} 
                    onClick={() => {handleAddMember(user)}}
                  />
                )
              }
          </div>
        </div>
        {error && <div className='error'>{error}</div>}
        <div className="new-group__member-list">
          {
            groupMemberList && groupMemberList.map(user => 
              <User 
                key={user?.id} 
                user={user} 
                onClick={() => {handleRemoveMember(user)}}
              />
            )
          }
        </div>
        <Button text={'Create Group'}/>
      </form>
    </div>
  )
}

export default NewGroup