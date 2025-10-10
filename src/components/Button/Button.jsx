import React from 'react'
import {} from 'lucide-react'
import './Button.css'
import { Spinner } from '../Sekeleton/Skeleton'

const Button = ({icon: Icon, text, className, onClick, type, loading}) => {
  return (
    <button 
      // className={className ? `active-button ${className}` : 'active-button'}
      className={`active-button ${className ? className : ''} ${loading ? 'loading' : ''}`} 
      onClick={onClick} 
      type={type}
      disabled={loading}
    >
        <p>{text}</p>
        {Icon && <Icon size={16}/>}
        {loading && <Spinner />}
    </button>
  )
}

export default Button;