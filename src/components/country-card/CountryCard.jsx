import React from 'react'
import style from './CountryCard.module.css'

export default function CountryCard({
  name,
  flag,
  content,
  contentLangMap,
  currencies
}) {
  const renderCurrency = (currency, index) => {
    const {symbol, value} = currency
    return (
      <div 
        key={index}
        className={style.currency}
      >
        {symbol} {value ? `:${value.toFixed(2)}` : ''}
      </div>
    )
  }
  const renderContentRow = (item) => {
    return Array.isArray(item)
      ? <div>{item.join()}</div>
      : <div>{item}</div>
  }
  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.flag}><img alt="flag" src={flag} /></div>
        <div className={style.title}>{name}</div>
      </div>
      <div className={style.content}>
      {
        Object.keys(content).map((key, index) => 
          <div 
            key={`content_${index}`}
            className={style.row}
          >
            <div className={style.title}>{contentLangMap[key]}: </div>
            <div>{renderContentRow(content[key])}</div>
          </div>
        )
      }
      </div>
      <div className={style.footer}>
        {
          currencies.map((currency, index) => renderCurrency(currency, index))
        }
      </div>
    </div>
  )
}