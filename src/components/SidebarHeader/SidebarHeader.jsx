import { Plus, X } from 'lucide-react'
import React from 'react'
import './SidebarHeader.css'

const SidebarHeader = ({title, closable, onNewIconClick, onCloseIconClick}) => {
  return (
    <header className='sidebar-header'>
        <div className="sidebar-title">{title}</div>
        {
          closable
          ? <div className="icon-container close icon" onClick={onCloseIconClick}>
                <X />
            </div>
          : <div className="icon-container close icon" onClick={onNewIconClick}>
                <Plus />
            </div>
        }
    </header>
  )
}

export default SidebarHeader