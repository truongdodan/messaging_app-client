import './Profile.css'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import GoBackBtn from '../../components/GoBackBtn/GoBackBtn'

const Tab = () => {
  return (
    <div className='profile__tab'>
        
    </div>
  )
}

const Profile = () => {
  const location = useLocation();
  const {userId} = useParams();

  return (
    <div className='profile'>
      {
        !userId 
        ?  <aside>
            <div className='sidebar-title'>Manage Profile</div>
            <div className="profile__tabs">
              <Link to={"/profile"} className={location.pathname === '/profile' && 'selected'}>Profile</Link>
              <Link to={"/profile/edit"} className={location.pathname === '/profile/edit' && 'selected'}>Edit Profile</Link>
              <Link to={"/profile/changepassword"} className={location.pathname === '/profile/changepassword' && 'selected'}>Change Password</Link>
            </div>
          </aside>
        : <aside>
            <div className="aside--header">
              <GoBackBtn />
              <div className='sidebar-title'>User Profile</div> 
            </div>
          </aside>
      }
        <Outlet />
    </div>
  )
}

export default Profile