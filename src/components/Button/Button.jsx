import React from 'react'
import {} from 'lucide-react'
import './Button.css'

const Button = ({icon: Icon, text, className}) => {
  return (
    <div className={className? `active-button ${className}` : 'active-button'}>
        <p>{text}</p>
        {Icon && <Icon size={16}/>}
    </div>
  )
}

export default Button;