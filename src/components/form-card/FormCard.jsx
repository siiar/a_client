import React from 'react'
// Components
import SuggestiveInput from '../suggestive-input/SuggestiveInput'
// Style
import style from './FormCard.module.css'

export default function FormCard(props) {
  const {
    themeName = '',
    title = '',
    inputs = {},
    suggestions = {},
    buttons = [],
    onInputChange = () => { },
    onBtnClick = () => { }
  } = props
  return (
    <div className={`${style.container} ${style[themeName]}`}>
      <div className={style.header}>
        {title}
      </div>
      <div className={style.content}>
        {
          Object.keys(inputs).map((name, index) =>
            <div
              key={`${name}_${index}`}
              className={style['input-wrapper']}
            >
              <SuggestiveInput
                name={name}
                type={inputs[name].type}
                placeholder={inputs[name].placeholder}
                onChange={({ target: { value } }) => onInputChange({ name, value })}
                suggestions={suggestions[name]}
              />
            </div>
          )
        }
      </div>
      <div className={style.footer}>
        {
          buttons.map(({ name, type, title }, index) =>
            <button
              key={`${name}_${index}`}
              className="button info large"
              onClick={() => onBtnClick({ name })}
            >{title}</button>
          )
        }
      </div>
    </div>
  )
}