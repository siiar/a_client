import React, 
{
  useEffect, 
  useState
} from 'react'
import {
  useLazyQuery
} from '@apollo/client'
// Mock Data
import { forms } from './mock'
// Queries
import {
  GET_COUNTRY,
  CONVERT_CURRENCY
} from '../../../../queries/home/index'
// Components
import FormCard from '../../../../components/form-card/FormCard'
import SuggestionRow from '../../../../components/suggestion-row/SuggestionRow'

export const DATA_TYPES = {
  GET_COUNTRY: 'GET_COUNTRY',
  CONVERT_CURRENCY: 'CONVERT_CURRENCY'
}

export default function(props) {
  const {
    countries,
    //
    onDataReady,
    onDataLoading,
    onDataError
  } = props
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
    //onCompleted: () => hideMessageBox()
  })
  // Get Country Effect Observer
  useEffect(() => {
    const { country } = dataGetCountry
      ? dataGetCountry
      : {}

    return !loadingGetCountry && country
      ? onDataReady({type: DATA_TYPES.GET_COUNTRY, data: country})
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
    // onCompleted: () => hideMessageBox()
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
      ? onDataReady({type: DATA_TYPES.CONVERT_CURRENCY, data: currencies})
      : null
  }, [loadingConvertCurrency, dataConvertCurrency])
  /**
   * 
   * Input Handlers
   */
  //
  // Input Handlers Map
  //
  const onInputChange = ({formName, value}) => {
    const map = {
      add_country: onInputCountry,
      convert_sek: onInputCurrency
    }

    map[formName](value)
  }
  //
  // Currency Input
  //
  const onInputCurrency = (value) => {
    setInputAmount(Number(value))
  }
  //
  // Country Input
  //
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
  //
  // Button Map Handler
  //
  const onFormBtnClick = ({formName, name}) => {
    const map = {
      'add_country_submit': onBtnClickAddCountry,
      'convert_sek_submit': onBtnClickConvertSek
    }
    map[`${formName}_${name}`]()
  }
  //
  // Add Country Button
  //
  const onBtnClickAddCountry = () => {
    getCountry({
      ...GET_COUNTRY.VARIABLES(inputCountry),
      context: { debounceKey: '1'}
    })
  }
  //
  // Convert Currency Button
  //
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
      ? onDataLoading()
      : null
  }, [loadingConvertCurrency, loadingGetCountry, onDataLoading])
  /**
   * Error Side Effects
   */
   useEffect(() => {
    return errorConvertCurrency
      ? onDataError(errorConvertCurrency.message)
      : null
  }, [errorConvertCurrency, onDataError])
  useEffect(() => {
    return errorGetCountry
      ? onDataError(errorGetCountry.message)
      : null
  }, [errorGetCountry, onDataError])
  /**
   * Render Component
   */
  return Object.keys(forms).map((key, index) => 
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