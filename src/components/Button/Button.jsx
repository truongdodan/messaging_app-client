import React from 'react'
import {} from 'lucide-react'
import './Button.css'

const Button = ({icon: Icon, text, className, onClick, type}) => {
  return (
    <button className={className? `active-button ${className}` : 'active-button'} onClick={onClick} type={type}>
        <p>{text}</p>
        {Icon && <Icon size={16}/>}
    </button>
  )
}

export default Button;