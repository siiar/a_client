import React from 'react'
import style from './MessageBox.module.css'

export default function({
  show,
  message,
  onPressClose
}) {
  return (
    <div 
      className={style['container-wrapper']} 
      style={{transform: show ? 'translate(-50%, 0)' : 'translate(-50%, -100%)'}}
    >
      <div className={style.container}>
        <div className={style.message}>{message}</div>
        <div 
          className={style.close}
          onClick={onPressClose}
        >X</div>
      </div>
    </div>
  )
}