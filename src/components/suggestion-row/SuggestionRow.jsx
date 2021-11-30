import React from 'react'
// Style
import style from './SuggestionRow.module.css'

export default function SuggestionRow({value, onClick}) {
  return (
    <div 
      className={style.container}
      onClick={onClick}
    >{value}</div>
  )
}