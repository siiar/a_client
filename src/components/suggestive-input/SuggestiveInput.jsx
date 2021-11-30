import React, {useState} from 'react'
// Style
import style from './SuggestiveInput.module.css'

export default function SuggestiveInput({
  name,
  type,
  placeholder,
  suggestions = {},
  onChange = () => {}
}) {
  const {
    IComponent,
    props_map,
    value_key,
    items
  } = suggestions
  const [
    inputValue,
    setInputValue
  ] = useState('')

  //
  const renderSuggestionItem = (item, index) => {
    return (
      <IComponent
        key={index}
        // assign props mapping the value of keys from props_map to item's key
        {
          ...(Object
          .keys(props_map)
          .reduce((acc, key) => ({
            ...acc, [key]: item[props_map[key]]
          }), {}))
        }
        // declare an onClick prop to notify the parent of the new value
        onClick={() => onInputChange({target: {value: item[value_key]}})}
      />
    )
  }
  const onInputChange = (e) => {
    const {
      target: {
        value
      }
    } = e
    setInputValue(value)
    onChange(e)
  }
  return (
    <div className={style.container}>
      <input
        name={name}
        type={type}
        value={inputValue}
        placeholder={placeholder}
        onChange={onInputChange}
      />
      {
        items && items.length > 0
          ? <div className={style.suggestions}>
              {items.map((item, index) => renderSuggestionItem(item, index))}
            </div>
          : null
      }
    </div>      
  )
}