import { gql } from '@apollo/client'
import raw from 'raw.macro'


export const GET_COUNTRY = {
  QUERY: gql`${raw('./GetCountry.gql')}`,
  VARIABLES: (name) => ({ variables: { name } })
}
export const CONVERT_CURRENCY = {
  QUERY: gql`${raw('./ConvertCurrency.gql')}`,
  VARIABLES: (base, amount, symbols) => ({ variables: { base, amount, symbols } })
}
