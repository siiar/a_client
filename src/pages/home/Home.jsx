import React, 
{
  useCallback,
  useEffect, 
  useState
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useApolloClient,
  useQuery
} from '@apollo/client'
// Message Box Hook
import useMessageBox from '../../hooks/UseMesssageBox'
import { LOCAL_APP } from '../../queries/app'
// Components
import CountryCard from '../../components/country-card/CountryCard'
import MessageBox from '../../components/message-box/MessageBox'
// Page Sub Components
import ComponentForms, {DATA_TYPES} from './components/forms/Forms'
// Private Page HOC
import AuthorizedPage from '../AuthorizedPage'
// Style
import style from './Home.module.css'

export default AuthorizedPage(function() {
  const client = useApolloClient()
  const navigate = useNavigate()
  const {
    showMessageBox,
    hideMessageBox,
    show,
    message
  } = useMessageBox()
  
  // List of Added Countries
  const [
    countries,
    setCountries
  ] = useState([])
  // Currency Exchange Map
  const [
    exchangeMap,
    setExchangeMap
  ] = useState({})
  // Currency Exchang Map Effect Observer
  useEffect(() => {
    setCountries(countries => 
      countries.map(country => 
      ({
        ...country, 
        currencies: country.currencies.map(
          currency => ({
            ...currency, 
            value: exchangeMap[currency.symbol]
          })
        )
      })
    ))
  }, [exchangeMap])
  // Get User Info
  const {
    data: {
      user : {name}
    } = {}
  } = useQuery(LOCAL_APP.QUERY)
  
  /**
   * Logout Handler
   */
  const logout = () => {
    client.clearStore()
    localStorage.clear()
    navigate('/login')
  }
  /**
   * Sub Component Event Handlers
   */
  const onDataReady = useCallback(({type, data}) => {
    const map = {
      [DATA_TYPES.GET_COUNTRY]: (country) => {
        setCountries((countries) => [...countries, country])
      },
      [DATA_TYPES.CONVERT_CURRENCY]: (currencies) => {
        setExchangeMap(currencies.reduce((acc, { symbol, value }) => ({
          ...acc, [symbol]: value
        }), {}))
      }
    }
    map[type](data)
    hideMessageBox()
  }, [])
  const onDataLoading = useCallback(() => {
    showMessageBox('Loading...')
  }, [])
  const onDataError = useCallback((message) => {
    showMessageBox(message)
  }, [])
  /**
   * Render Component
   */
  return (
    <div className={`page ${style.page}`}>
      <MessageBox 
        show={show}
        message={message}
        onPressClose={() => hideMessageBox()}
      />
      <div className={style['countries-container']}>
        <div className={style.header}>
          Countries
        </div>
        <div className={style.content}>
          {
            countries.length > 0
              ? countries.map(({
                  name, 
                  currencies,
                  flag,
                  //
                  topLevelDomain,
                  region,
                  population,
                  capital
                }, index) => 
                  <CountryCard 
                    key={`country_card_${index}`} 
                    name={name}
                    flag={flag}
                    currencies={currencies} 
                    content={{
                      topLevelDomain,
                      region,
                      population,
                      capital
                    }}
                    contentLangMap={{
                      topLevelDomain: 'Top Level Domain',
                      region: 'Region',
                      population: 'Population',
                      capital: 'Capital'
                    }}
                  />
                )
              : <div className={style['countries-placeholder']}>No Country Added Yet!</div>
          }
        </div>
      </div>
      <div className={style['controls-container']}>
        <div className={style.header}>
          <div className={style['user-info']}>{name}</div>
          <div className={style.menu}><div onClick={logout}>Logout</div></div>
        </div>
        <div className={style.content}>
          <ComponentForms
            countries={countries}
            onDataReady={onDataReady}
            onDataLoading={onDataLoading}
            onDataError={onDataError}
          />
        </div>
      </div>
    </div>
  )
})