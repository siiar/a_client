import React, 
{
  useEffect, 
  useState
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useApolloClient,
  useLazyQuery,
  useQuery
} from '@apollo/client'
// Message Box Hook
import useMessageBox from '../../hooks/UseMesssageBox'
// Mock Data
import { forms } from './mock'
// Queries
import {
  GET_COUNTRY,
  CONVERT_CURRENCY
} from '../../queries/home/index'
import { LOCAL_APP } from '../../queries/app'
// Components
import CountryCard from '../../components/country-card/CountryCard'
import FormCard from '../../components/form-card/FormCard'
import SuggestionRow from '../../components/suggestion-row/SuggestionRow'
import MessageBox from '../../components/message-box/MessageBox'
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
  /**
   * State Variables
   */
  // Input Exchange Amount
  const [
    inputAmount,
    setInputAmount
  ] = useState(0)
  // Input Country
  const [
    inputCountry,
    setInputCountry
  ] = useState('')
  // Suggestionss For Country Input
  const [
    suggestions,
    setSuggestions
  ] = useState({})
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
   * Quereis
   */
  // Get Country Query
  const [
    getCountry,
    {
      data: dataGetCountry,
      loading: loadingGetCountry,
      error: errorGetCountry
    }
  ] = useLazyQuery(GET_COUNTRY.QUERY, {
    // 'network-only' fetch policy is needed so onCompleted is called every time
    // this is apollojs bug
    fetchPolicy: 'network-only',
    onCompleted: () => hideMessageBox()
  })
  // Get Country Effect Observer
  useEffect(() => {
    const { country } = dataGetCountry
      ? dataGetCountry
      : {}

    return !loadingGetCountry && country
      ? setCountries((countries) => [...countries, country])
      : null
  }, [loadingGetCountry, dataGetCountry])
  // Convert Currency Query
  const [
    convertCurrency,
    {
      data: dataConvertCurrency,
      loading: loadingConvertCurrency,
      error: errorConvertCurrency
    }
  ] = useLazyQuery(CONVERT_CURRENCY.QUERY, {
    // 'network-only' fetch policy is needed so onCompleted is called every time
    // this is apollojs bug
    fetchPolicy: 'network-only',
    onCompleted: () => hideMessageBox()
  })
  // Convert Currency Effect Observer
  useEffect(() => {
    const {
      exchange: { 
        currencies 
      } = {}
    } = dataConvertCurrency
      ? dataConvertCurrency
      : {}
    return !loadingConvertCurrency && currencies
      ? setExchangeMap(currencies.reduce((acc, { symbol, value }) => ({
        ...acc, [symbol]: value
      }), {}))
      : null
  }, [loadingConvertCurrency, dataConvertCurrency])

  /**
   * 
   * Input Handlers
   */
  // Input Handlers Map
  const onInputChange = ({formName, value}) => {
    const map = {
      add_country: onInputCountry,
      convert_sek: onInputCurrency
    }

    map[formName](value)
  }
  // Currency Input
  const onInputCurrency = (value) => {
    setInputAmount(Number(value))
  }
  // Country Input
  const onInputCountry = (value) => {
    const {
      add_country: {
        inputs: {
          country: {autofill_items}
        }
      }
    } = forms
    setSuggestions({
      country: {
        items: value.trim().length > 0 && !autofill_items.some((item) => item === value)
          ? autofill_items
            .filter(item => item.toLowerCase().startsWith(value.toLowerCase()))
            .map(item => ({name: item}))
          : {},
        value_key: 'name',
        props_map: {value: 'name'},
        IComponent: SuggestionRow
      }
    })
    setInputCountry(value)
  }
  /**
   * Button Handlers
   */
  // Button Map Handler
  const onFormBtnClick = ({formName, name}) => {
    const map = {
      'add_country_submit': onBtnClickAddCountry,
      'convert_sek_submit': onBtnClickConvertSek
    }
    map[`${formName}_${name}`]()
  }
  // Add Country Button
  const onBtnClickAddCountry = () => {
    getCountry({
      ...GET_COUNTRY.VARIABLES(inputCountry),
      context: { debounceKey: '1'}
    })
  }
  // Convert Currency Button
  const onBtnClickConvertSek = () => {
    const symbols = countries.map(
      ({currencies}) => currencies.reduce((acc, {symbol}) => [...acc, symbol], [])
    ).flat()
    convertCurrency({
      ...CONVERT_CURRENCY.VARIABLES('sek', inputAmount, [...(new Set(symbols))]),
      context: { debounceKey: '1'}
    })
  }
  /**
   * Loading Side Effects
   */
  useEffect(() => {
    return loadingConvertCurrency || loadingGetCountry
      ? showMessageBox('Loading...')
      : null
  }, [loadingConvertCurrency, loadingGetCountry, showMessageBox])
  /**
   * Error Side Effects
   */
  useEffect(() => {
    return errorConvertCurrency
      ? showMessageBox(errorConvertCurrency.message)
      : null
  }, [errorConvertCurrency, showMessageBox])
  useEffect(() => {
    return errorGetCountry
      ? showMessageBox(errorGetCountry.message)
      : null
  }, [errorGetCountry, showMessageBox])
  /**
   * Logout Handler
   */
  const logout = () => {
    client.clearStore()
    localStorage.clear()
    navigate('/login')
  }
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
          {
            Object.keys(forms).map((key, index) => 
              <FormCard
                key={`form_${key}_${index}`}
                title={forms[key].title}
                inputs={forms[key].inputs}
                suggestions={suggestions}
                buttons={forms[key].buttons}
                onInputChange={({name, value}) => onInputChange({formName: key, name, value})}
                onBtnClick={({name}) => onFormBtnClick({formName: key, name})}
              />
            )
          }
        </div>
      </div>
    </div>
  )
})