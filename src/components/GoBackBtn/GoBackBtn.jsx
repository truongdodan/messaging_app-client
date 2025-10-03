import { ArrowLeftIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './GoBackBtn.css'

const GoBackBtn = () => {
    const navigate = useNavigate();

  return (
    <div className="icon-container go-back" onClick={() => {navigate(-1);}}>
        <ArrowLeftIcon />
    </div>
  )
}

export default GoBackBtn