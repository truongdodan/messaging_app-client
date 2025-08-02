import React from 'react'
import PropTypes from 'prop-types'
import './Alert.css'

const Alert = ({type, message}) => {
  const isDefault = type === 'DEFAULT';

  return (
    <div className={isDefault ? `alert alert--default` : 'alert alert--danger'}>{message}</div>
  )
}

Alert.propTypes = {
  type: PropTypes.oneOf(['DEFAULT', 'DANGER'])
}

export default Alert;